<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanApplication extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id', 'loan_amount', 'loan_purpose', 'loan_term_months',
        'monthly_income', 'employment_type', 'employer_name',
        'additional_notes', 'status', 'admin_remarks', 'reviewed_at',
        'reviewed_by', 'is_eligible',
    ];

    protected $casts = [
        'loan_amount' => 'decimal:2',
        'monthly_income' => 'decimal:2',
        'reviewed_at' => 'datetime',
        'is_eligible' => 'boolean',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function documents() {
        return $this->hasMany(LoanDocument::class);
    }

    public function reviewer() {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}