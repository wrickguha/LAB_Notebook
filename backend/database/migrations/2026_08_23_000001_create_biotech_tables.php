<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->nullable()->after('password');
            $table->string('institution')->nullable()->after('role');
            $table->string('lab')->nullable()->after('institution');
            $table->string('avatar')->nullable()->after('lab');
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->nullable();
            $table->text('description')->nullable();
            $table->string('status')->default('Active');
            $table->string('banner')->nullable();
            $table->integer('progress')->default(0);
            $table->json('members')->nullable();
            $table->timestamp('last_activity')->nullable();
            $table->timestamps();
        });

        Schema::create('project_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->boolean('completed')->default(false);
            $table->timestamps();
        });

        Schema::create('notebook_folders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('notebook_entries', function (Blueprint $table) {
            $table->id();
            $table->string('folder_id');
            $table->string('project_id')->nullable();
            $table->string('title');
            $table->string('status')->default('Draft');
            $table->longText('content')->nullable();
            $table->string('author')->nullable();
            $table->string('date')->nullable();
            $table->timestamps();
        });

        Schema::create('shared_resources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('Folder');
            $table->string('owner')->nullable();
            $table->json('shared_with')->nullable();
            $table->string('last_modified')->nullable();
            $table->timestamps();
        });

        Schema::create('research_papers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('authors');
            $table->string('journal')->nullable();
            $table->integer('year')->nullable();
            $table->string('doi')->nullable();
            $table->text('summary')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user');
            $table->string('action');
            $table->string('target');
            $table->string('ip')->nullable();
            $table->string('status')->default('Verified');
            $table->string('timestamp')->nullable();
            $table->timestamps();
        });

        Schema::create('calculator_history', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('calculator_name')->nullable();
            $table->text('formula')->nullable();
            $table->text('input')->nullable();
            $table->text('result')->nullable();
            $table->json('input_json')->nullable();
            $table->json('output_json')->nullable();
            $table->string('project_id')->nullable();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('title');
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('calculator_history');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('research_papers');
        Schema::dropIfExists('shared_resources');
        Schema::dropIfExists('notebook_entries');
        Schema::dropIfExists('notebook_folders');
        Schema::dropIfExists('project_milestones');
        Schema::dropIfExists('projects');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'institution', 'lab', 'avatar']);
        });
    }
};
