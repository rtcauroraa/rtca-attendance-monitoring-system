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
        Schema::create('ashore_aboard_passes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainee_id')->constrained()->cascadeOnDelete();
            $table->integer('duration_days');
            $table->dateTime('issued_at');
            $table->dateTime('expires_at');
            $table->dateTime('aboard_at')->nullable();
            $table->enum('status', ['active', 'aboard', 'expired', 'cancelled'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ashore_passes');
    }
};
