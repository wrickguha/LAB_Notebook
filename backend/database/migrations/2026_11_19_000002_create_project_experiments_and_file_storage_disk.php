<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_experiments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedInteger('sequence');
            $table->string('name');
            $table->date('experiment_date')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('completed')->default(false);
            $table->timestamps();

            $table->unique(['project_id', 'sequence']);
            $table->index(['project_id', 'experiment_date']);
        });

        Schema::table('files', function (Blueprint $table) {
            $table->string('storage_disk', 30)->default('public');
        });

        DB::table('projects')->orderBy('id')->chunkById(100, function ($projects): void {
            foreach ($projects as $project) {
                $sequence = 0;
                DB::table('project_milestones')
                    ->where('project_id', $project->id)
                    ->orderBy('id')
                    ->get()
                    ->each(function ($milestone) use ($project, &$sequence): void {
                        $sequence++;
                        DB::table('project_experiments')->insert([
                            'project_id' => $project->id,
                            'created_by' => $project->user_id,
                            'sequence' => $sequence,
                            'name' => $milestone->name,
                            'experiment_date' => $project->start_date
                                ? Carbon::parse($project->start_date)->addWeeks($sequence - 1)->toDateString()
                                : null,
                            'notes' => $milestone->completed
                                ? 'Completed successfully.'
                                : 'In progress.',
                            'completed' => $milestone->completed,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    });
            }
        });
    }

    public function down(): void
    {
        Schema::table('files', function (Blueprint $table) {
            $table->dropColumn('storage_disk');
        });

        Schema::dropIfExists('project_experiments');
    }
};
