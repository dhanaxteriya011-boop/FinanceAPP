<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('loan_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('loan_amount', 12, 2);
            $table->string('loan_purpose');
            $table->integer('loan_term_months');
            $table->decimal('monthly_income', 12, 2);
            $table->string('employment_type');
            $table->string('employer_name')->nullable();
            $table->text('additional_notes')->nullable();
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected'])->default('pending');
            $table->text('admin_remarks')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->boolean('is_eligible')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('loan_applications');
    }
};