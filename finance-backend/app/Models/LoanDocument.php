<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanDocument extends Model {
    use HasFactory;

    protected $fillable = [
        'loan_application_id', 'user_id', 'document_type',
        'document_name', 'file_path', 'file_size', 'mime_type',
        'verification_status', 'admin_note',
    ];

    public function loanApplication() {
        return $this->belongsTo(LoanApplication::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function getFileUrlAttribute() {
        return asset('storage/' . $this->file_path);
    }
}