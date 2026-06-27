<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trainee_movements', function (Blueprint $table) {
            $table->id();

            // 👤 TRAINEE
            $table->foreignId('trainee_id')
                ->constrained()
                ->cascadeOnDelete();

            // 📌 TYPE OF MOVEMENT
            $table->enum('type', [
                'LIBERTY',
                'LEAVE',
                'OFFICIAL_BUSINESS'
            ]);

            // 📌 CURRENT MODE (OUT / IN)
            $table->enum('mode', [
                'ASHORE',
                'ABOARD'
            ]);

            // ⏱ ASHORE DURATION (in days)
            $table->integer('duration')->nullable();

            // 🕒 IMPORTANT TIME FIELDS
            $table->timestamp('issued_at')->useCurrent();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('returned_at')->nullable();

            // 📊 STATUS (LIFECYCLE ONLY)
            $table->enum('status', [
                'ACTIVE',
                'COMPLETED',
                'EXPIRED',
                'CANCELLED'
            ])->default('ACTIVE');

            // ⭐ NEW: RETURN CLASSIFICATION
            $table->enum('return_type', [
                'ON_TIME',
                'LATE',
            ])->nullable();

            // ⭐ OPTIONAL: HOW LATE (VERY USEFUL FOR REPORTS)
            $table->integer('late_minutes')->nullable();

            $table->timestamps();

            // 🚀 PERFORMANCE INDEXES (IMPORTANT FOR QR SCANNING)
            $table->index(['trainee_id', 'status']);
            $table->index(['trainee_id', 'returned_at']);
            $table->index('expires_at');
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainee_movements');
    }
};
