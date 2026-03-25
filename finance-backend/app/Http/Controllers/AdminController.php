<?php
namespace App\Http\Controllers;

use App\Models\LoanApplication;
use App\Models\LoanDocument;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller {

    // Get dashboard stats
    public function dashboard() {
        $stats = [
            'total_applications'  => LoanApplication::count(),
            'pending'             => LoanApplication::where('status', 'pending')->count(),
            'under_review'        => LoanApplication::where('status', 'under_review')->count(),
            'approved'            => LoanApplication::where('status', 'approved')->count(),
            'rejected'            => LoanApplication::where('status', 'rejected')->count(),
            'total_users'         => User::where('is_admin', false)->count(),
            'total_loan_amount'   => LoanApplication::where('status', 'approved')->sum('loan_amount'),
            'pending_documents'   => LoanDocument::where('verification_status', 'pending')->count(),
        ];

        return response()->json($stats);
    }

    // Get all applications
    public function applications(Request $request) {
        $query = LoanApplication::with(['user', 'documents', 'reviewer'])->latest();

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json($query->paginate(15));
    }

    // Get single application for admin
    public function showApplication($id) {
        $application = LoanApplication::with(['user', 'documents', 'reviewer'])->findOrFail($id);
        return response()->json($application);
    }

    // Update application status
    public function updateStatus(Request $request, $id) {
        $request->validate([
            'status'        => 'required|in:under_review,approved,rejected',
            'admin_remarks' => 'nullable|string',
            'is_eligible'   => 'nullable|boolean',
        ]);

        $application = LoanApplication::findOrFail($id);
        $application->update([
            'status'        => $request->status,
            'admin_remarks' => $request->admin_remarks,
            'is_eligible'   => $request->is_eligible,
            'reviewed_by'   => $request->user()->id,
            'reviewed_at'   => now(),
        ]);

        return response()->json([
            'message'     => 'Application status updated',
            'application' => $application->load(['user', 'documents']),
        ]);
    }

    // Verify a document
    public function verifyDocument(Request $request, $documentId) {
        $request->validate([
            'verification_status' => 'required|in:verified,rejected',
            'admin_note'          => 'nullable|string',
        ]);

        $document = LoanDocument::findOrFail($documentId);
        $document->update([
            'verification_status' => $request->verification_status,
            'admin_note'          => $request->admin_note,
        ]);

        return response()->json([
            'message'  => 'Document updated',
            'document' => $document,
        ]);
    }

    // Get all users
    public function users() {
        $users = User::where('is_admin', false)
            ->withCount('loanApplications')
            ->latest()
            ->get();

        return response()->json($users);
    }

    // Serve document file
    public function viewDocument($id) {
    $document = LoanDocument::findOrFail($id);
    
    // Path should be storage/app/public/loan-documents/...
    $path = storage_path('app/public/' . $document->file_path);

    if (!file_exists($path)) {
        return response()->json(['message' => 'File not found on server'], 404);
    }

    // Return the file with proper headers for the React Blob handler
    return response()->file($path, [
        'Content-Type' => $document->mime_type,
        'Access-Control-Expose-Headers' => 'Content-Type'
    ]);
}
}