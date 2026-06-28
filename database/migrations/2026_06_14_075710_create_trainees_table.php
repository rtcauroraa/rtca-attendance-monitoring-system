<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('trainees', function (Blueprint $table) {
            $table->id();

            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->string('serial_number');
            
            $table->date('birthday')->nullable();
            $table->string('religion')->nullable();
            $table->string('contact_no')->nullable();
            $table->string('email')->unique();
            $table->string('status')->nullable();
            $table->text('address')->nullable();
            $table->string('emergency_contact_person')->nullable();
            $table->string('emergency_contact_no')->nullable();
            $table->string('suffix')->nullable();
            $table->string('company')->nullable();
            $table->string('blood_type')->nullable();
            $table->string('height')->nullable();
            $table->string('weight')->nullable();
            $table->string('qr_code')->nullable();

            $table->string('identifying_marks')->nullable();
            $table->string('eye_color')->nullable();
            $table->string('hair_color')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainees');
    }
};
