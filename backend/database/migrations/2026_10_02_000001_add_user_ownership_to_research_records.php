<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['shared_resources', 'research_papers', 'audit_logs'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('user_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach (['audit_logs', 'research_papers', 'shared_resources'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropConstrainedForeignId('user_id');
            });
        }
    }
};