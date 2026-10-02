<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notebook_entries', function (Blueprint $table) {
            $table->foreignId('signed_by')->nullable()->after('content_json')->constrained('users')->nullOnDelete();
            $table->timestamp('signed_at')->nullable()->after('signed_by');
            $table->char('signature_hash', 64)->nullable()->after('signed_at');
        });
    }

    public function down(): void
    {
        Schema::table('notebook_entries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('signed_by');
            $table->dropColumn(['signed_at', 'signature_hash']);
        });
    }
};