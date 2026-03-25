<?php
namespace App\Http\Controllers;

use App\Models\LoanApplication;
use App\Models\LoanDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LoanApplicationController extends Controller {

    // Check loan eligibility (before submission)
    public function checkEligibility(Request $request) {
        $request->validate([
            'loan_amount'      => 'required|numeric|min:1000',
            'monthly_income'   => 'required|numeric|min:1',
            'loan_term_months' => 'required|integer|min:6|max:360',
            'employment_type'  => 'required|string',
        ]);

        $loanAmount    = $request->loan_amount;
        $monthlyIncome = $request->monthly_income;
        $termMonths    = $request->loan_term_months;
        $employment    = $request->employment_type;

        // Eligibility logic
        $eligible       = true;
        $reasons        = [];
        $interestRate   = 0.12; // 12% annual
        $monthlyPayment = ($loanAmount * ($interestRate / 12)) /
                          (1 - pow(1 + ($interestRate / 12), -$termMonths));
        $dtiRatio       = ($monthlyPayment / $monthlyIncome) * 100;

        if ($dtiRatio > 40) {
            $eligible  = false;
            $reasons[] = "Monthly payment (₹" . number_format($monthlyPayment, 2) . ") exceeds 40% of monthly income.";
        }

        if ($monthlyIncome < 15000) {
            $eligible  = false;
            $reasons[] = "Minimum monthly income requirement is ₹15,000.";
        }

        if ($employment === 'unemployed') {
            $eligible  = false;
            $reasons[] = "Unemployed applicants are not eligible.";
        }

        if ($loanAmount > $monthlyIncome * 60) {
            $eligible  = false;
            $reasons[] = "Loan amount exceeds 60x monthly income limit.";
        }

        return response()->json([
            'eligible'        => $eligible,
            'reasons'         => $reasons,
            'monthly_payment' => round($monthlyPayment, 2),
            'dti_ratio'       => round($dtiRatio, 2),
            'interest_rate'   => $interestRate * 100,
            'total_payable'   => round($monthlyPayment * $termMonths, 2),
        ]);
    }

    // Submit loan application
    public function store(Request $request) {
        $request->validate([
            'loan_amount'      => 'required|numeric|min:1000',
            'loan_purpose'     => 'required|string|max:500',
            'loan_term_months' => 'required|integer|min:6|max:360',
            'monthly_income'   => 'required|numeric|min:1',
            'employment_type'  => 'required|string',
            'employer_name'    => 'nullable|string|max:255',
            'additional_notes' => 'nullable|string',
        ]);

        $application = LoanApplication::create([
            'user_id'          => $request->user()->id,
            'loan_amount'      => $request->loan_amount,
            'loan_purpose'     => $request->loan_purpose,
            'loan_term_months' => $request->loan_term_months,
            'monthly_income'   => $request->monthly_income,
            'employment_type'  => $request->employment_type,
            'employer_name'    => $request->employer_name,
            'additional_notes' => $request->additional_notes,
            'status'           => 'pending',
        ]);

        return response()->json([
            'message'     => 'Application submitted successfully',
            'application' => $application->load('documents'),
        ], 201);
    }

    // Upload document
    public function uploadDocument(Request $request, $applicationId) {
        $request->validate([
            'document_type' => 'required|string',
            'document'      => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $application = LoanApplication::findOrFail($applicationId);

        if ($application->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $file     = $request->file('document');
        $path     = $file->store('loan-documents/' . $applicationId, 'public');
        $fileSize = round($file->getSize() / 1024, 2) . ' KB';

        $document = LoanDocument::create([
            'loan_application_id' => $applicationId,
            'user_id'             => $request->user()->id,
            'document_type'       => $request->document_type,
            'document_name'       => $file->getClientOriginalName(),
            'file_path'           => $path,
            'file_size'           => $fileSize,
            'mime_type'           => $file->getMimeType(),
            'verification_status' => 'pending',
        ]);

        return response()->json([
            'message'  => 'Document uploaded successfully',
            'document' => array_merge($document->toArray(), [
                'file_url' => asset('storage/' . $path),
            ]),
        ], 201);
    }

    // Get user's applications
    public function index(Request $request) {
        $applications = LoanApplication::where('user_id', $request->user()->id)
            ->with(['documents'])
            ->latest()
            ->get();

        return response()->json($applications);
    }

    // Get single application
    public function show(Request $request, $id) {
        $application = LoanApplication::where('user_id', $request->user()->id)
            ->with(['documents', 'reviewer'])
            ->findOrFail($id);

        return response()->json($application);
    }
}