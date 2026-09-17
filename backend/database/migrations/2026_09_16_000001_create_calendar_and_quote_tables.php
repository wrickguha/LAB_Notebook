<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('google_calendar_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('google_account_email')->nullable();
            $table->text('access_token');
            $table->text('refresh_token')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->text('quote');
            $table->string('author');
            $table->timestamps();
        });

        Schema::create('user_quote_selections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->date('selected_on');
            $table->timestamps();
            $table->unique(['user_id', 'selected_on']);
        });

        DB::table('quotes')->insert([
            ['quote' => 'The important thing is to never stop questioning.', 'author' => 'Albert Einstein', 'created_at' => now(), 'updated_at' => now()],
            ['quote' => 'Great things are done by a series of small things brought together.', 'author' => 'Vincent van Gogh', 'created_at' => now(), 'updated_at' => now()],
            ['quote' => 'Somewhere, something incredible is waiting to be known.', 'author' => 'Carl Sagan', 'created_at' => now(), 'updated_at' => now()],
            ['quote' => 'Research is formalized curiosity. It is poking and prying with a purpose.', 'author' => 'Zora Neale Hurston', 'created_at' => now(), 'updated_at' => now()],
            ['quote' => 'The reward of our work is not what we get, but what we become.', 'author' => 'Paulo Coelho', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('user_quote_selections');
        Schema::dropIfExists('quotes');
        Schema::dropIfExists('google_calendar_connections');
    }
};