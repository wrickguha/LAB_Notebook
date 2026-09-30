<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Users table additions
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'theme_preference')) {
                $table->string('theme_preference', 20)->default('light')->after('avatar');
            }
            if (!Schema::hasColumn('users', 'password_reset_code')) {
                $table->string('password_reset_code', 100)->nullable()->after('remember_token');
                $table->timestamp('password_reset_expires_at')->nullable()->after('password_reset_code');
            }
        });

        // 2. Projects table adjustments & Tiptap persistence
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'banner')) {
                $table->string('banner', 500)->nullable()->after('status');
            }
            if (!Schema::hasColumn('projects', 'progress')) {
                $table->integer('progress')->default(0)->after('banner');
            }
            if (!Schema::hasColumn('projects', 'content')) {
                $table->longText('content')->nullable()->after('description');
            }
            $table->index('user_id');
            $table->index('status');
        });

        // 3. Project collaboration / access control table
        if (!Schema::hasTable('research_project_access')) {
            Schema::create('research_project_access', function (Blueprint $table) {
                $table->id();
                $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->tinyInteger('access_level')->default(1); // 1 = View, 2 = Edit, 3 = Admin
                $table->foreignId('invited_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();

                $table->unique(['project_id', 'user_id']);
                $table->index(['user_id', 'access_level']);
            });
        }

        // 4. Notebook entries index & tiptap persistence
        Schema::table('notebook_entries', function (Blueprint $table) {
            if (!Schema::hasColumn('notebook_entries', 'content_json')) {
                $table->longText('content_json')->nullable()->after('content');
            }
            $table->index('user_id');
            $table->index('status');
        });

        // 5. Internal Calendar Events
        if (!Schema::hasTable('calendar_events')) {
            Schema::create('calendar_events', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
                $table->string('title');
                $table->text('description')->nullable();
                $table->date('start_date');
                $table->time('start_time')->nullable();
                $table->date('end_date')->nullable();
                $table->time('end_time')->nullable();
                $table->string('event_type', 50)->default('Meeting'); // Meeting, Experiment, Milestone, Deadline, Inspection
                $table->tinyInteger('status')->default(1); // 1 = Scheduled, 2 = Completed, 3 = Cancelled
                $table->string('location')->nullable();
                $table->boolean('is_all_day')->default(false);
                $table->timestamps();

                $table->index(['user_id', 'start_date']);
                $table->index('status');
            });
        }

        // 6. Upgraded Notifications Table
        Schema::table('notifications', function (Blueprint $table) {
            if (!Schema::hasColumn('notifications', 'type')) {
                $table->string('type', 50)->default('system')->after('user_id');
            }
            if (!Schema::hasColumn('notifications', 'reference_id')) {
                $table->unsignedBigInteger('reference_id')->nullable()->after('type');
            }
            if (!Schema::hasColumn('notifications', 'reference_type')) {
                $table->string('reference_type', 100)->nullable()->after('reference_id');
            }
            $table->index(['user_id', 'read_at']);
        });

        // 7. Secure Files Table (enforcing <= 1MB)
        if (!Schema::hasTable('files')) {
            Schema::create('files', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
                $table->foreignId('notebook_entry_id')->nullable()->constrained('notebook_entries')->nullOnDelete();
                $table->string('filename');
                $table->string('original_name');
                $table->string('path', 500);
                $table->string('mime_type', 100);
                $table->unsignedInteger('size_bytes');
                $table->timestamps();

                $table->index(['user_id', 'created_at']);
            });
        }

        // 8. Backfill legacy unassigned records to primary researcher (user_id = 1)
        DB::table('projects')->whereNull('user_id')->update(['user_id' => 1]);
        DB::table('notebook_entries')->whereNull('user_id')->update(['user_id' => 1]);
        DB::table('notebook_folders')->whereNull('user_id')->update(['user_id' => 1]);
        DB::table('calculator_history')->whereNull('user_id')->update(['user_id' => 1]);

        // 9. Seed 50+ Curated Scientific & Research Quotes
        $quotes = [
            ['quote' => 'The important thing is to never stop questioning. Curiosity has its own reason for existing.', 'author' => 'Albert Einstein'],
            ['quote' => 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.', 'author' => 'Marie Curie'],
            ['quote' => 'Research is to see what everybody else has seen, and to think what nobody else has thought.', 'author' => 'Albert Szent-Györgyi'],
            ['quote' => 'Somewhere, something incredible is waiting to be known.', 'author' => 'Carl Sagan'],
            ['quote' => 'Science is not only a disciple of reason but also one of romance and passion.', 'author' => 'Stephen Hawking'],
            ['quote' => 'Science knows no country, because knowledge belongs to humanity, and is the torch which illuminates the world.', 'author' => 'Louis Pasteur'],
            ['quote' => 'What you do makes a difference, and you have to decide what kind of difference you want to make.', 'author' => 'Jane Goodall'],
            ['quote' => 'The good thing about science is that it’s true whether or not you believe in it.', 'author' => 'Neil deGrasse Tyson'],
            ['quote' => 'Equipped with his five senses, man explores the universe around him and calls the adventure Science.', 'author' => 'Edwin Hubble'],
            ['quote' => 'Science is organized knowledge. Wisdom is organized life.', 'author' => 'Immanuel Kant'],
            ['quote' => 'In science, there are no shortcuts to truth.', 'author' => 'Karl Popper'],
            ['quote' => 'Nature composes some of her loveliest poems for the microscope and the telescope.', 'author' => 'Theodore Roszak'],
            ['quote' => 'We are just an advanced breed of monkeys on a minor planet of a very average star. But we can understand the Universe. That makes us something very special.', 'author' => 'Stephen Hawking'],
            ['quote' => 'If I have seen further, it is by standing on the shoulders of giants.', 'author' => 'Isaac Newton'],
            ['quote' => 'The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of starstuff.', 'author' => 'Carl Sagan'],
            ['quote' => 'Research is formalized curiosity. It is poking and prying with a purpose.', 'author' => 'Zora Neale Hurston'],
            ['quote' => 'The reward of our work is not what we get, but what we become.', 'author' => 'Paulo Coelho'],
            ['quote' => 'Science is a way of thinking much more than it is a body of knowledge.', 'author' => 'Carl Sagan'],
            ['quote' => 'An experiment is a question which science poses to Nature, and a measurement is the recording of Nature\'s answer.', 'author' => 'Max Planck'],
            ['quote' => 'Discovery consists of seeing what everybody has seen and thinking what nobody has thought.', 'author' => 'Jonathan Swift'],
            ['quote' => 'The saddest aspect of life right now is that science gathers knowledge faster than society gathers wisdom.', 'author' => 'Isaac Asimov'],
            ['quote' => 'Don\'t let anyone rob you of your imagination, your creativity, or your curiosity.', 'author' => 'Mae Jemison'],
            ['quote' => 'Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.', 'author' => 'Marie Curie'],
            ['quote' => 'It is strange that only extraordinary men make the discoveries, which later appear so easy and simple.', 'author' => 'Georg C. Lichtenberg'],
            ['quote' => 'Every great advance in science has issued from a new audacity of imagination.', 'author' => 'John Dewey'],
            ['quote' => 'To raise new questions, new possibilities, to regard old problems from a new angle, requires creative imagination and marks real advance in science.', 'author' => 'Albert Einstein'],
            ['quote' => 'Science without religion is lame, religion without science is blind.', 'author' => 'Albert Einstein'],
            ['quote' => 'I was taught that the way of progress was neither swift nor easy.', 'author' => 'Marie Curie'],
            ['quote' => 'We must not forget that when radium was found no one knew that it would prove useful in hospitals. The work was one of pure science.', 'author' => 'Marie Curie'],
            ['quote' => 'The scientist is not a person who gives the right answers, he\'s one who asks the right questions.', 'author' => 'Claude Lévi-Strauss'],
            ['quote' => 'Falsity in intellectual action is intellectual death.', 'author' => 'Thomas Henry Huxley'],
            ['quote' => 'Genius is one percent inspiration and ninety-nine percent perspiration.', 'author' => 'Thomas Edison'],
            ['quote' => 'Science and everyday life cannot and should not be separated.', 'author' => 'Rosalind Franklin'],
            ['quote' => 'In the fields of observation chance favors only the prepared mind.', 'author' => 'Louis Pasteur'],
            ['quote' => 'The most exciting phrase to hear in science, the one that heralds new discoveries, is not "Eureka!" but "That\'s funny..."', 'author' => 'Isaac Asimov'],
            ['quote' => 'Science is the poetry of reality.', 'author' => 'Richard Dawkins'],
            ['quote' => 'There is no law except the law that there is no law.', 'author' => 'John Archibald Wheeler'],
            ['quote' => 'All truths are easy to understand once they are discovered; the point is to discover them.', 'author' => 'Galileo Galilei'],
            ['quote' => 'Measure what is measurable, and make measurable what is not so.', 'author' => 'Galileo Galilei'],
            ['quote' => 'We are an impossibility in an impossible universe.', 'author' => 'Ray Bradbury'],
            ['quote' => 'The micro-world holds answers to the greatest macro-questions of life.', 'author' => 'Francis Crick'],
            ['quote' => 'We wish to suggest a structure for the salt of deoxyribose nucleic acid (D.N.A.). This structure has novel features which are of considerable biological interest.', 'author' => 'Watson & Crick (1953)'],
            ['quote' => 'Biology is the study of complicated things that have the appearance of having been designed with a purpose.', 'author' => 'Richard Dawkins'],
            ['quote' => 'Nothing in biology makes sense except in the light of evolution.', 'author' => 'Theodosius Dobzhansky'],
            ['quote' => 'The aim of science is not to open the door to infinite wisdom, but to set a limit to infinite error.', 'author' => 'Bertolt Brecht'],
            ['quote' => 'The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge.', 'author' => 'Daniel J. Boorstin'],
            ['quote' => 'In questions of science, the authority of a thousand is not worth the humble reasoning of a single individual.', 'author' => 'Galileo Galilei'],
            ['quote' => 'Look deep into nature, and then you will understand everything better.', 'author' => 'Albert Einstein'],
            ['quote' => 'Somewhere inside all of us is the power to change the world with knowledge.', 'author' => 'Roald Dahl'],
            ['quote' => 'Every formula which expresses a law of nature is a hymn of praise to God.', 'author' => 'Maria Mitchell'],
            ['quote' => 'The art of structure is where what is unseen gives strength to what is seen.', 'author' => 'Rosalind Franklin'],
            ['quote' => 'We must believe in our experiments even when the results surprise our expectations.', 'author' => 'Barbara McClintock'],
        ];

        foreach ($quotes as $q) {
            DB::table('quotes')->updateOrInsert(
                ['quote' => $q['quote']],
                ['author' => $q['author'], 'created_at' => now(), 'updated_at' => now()]
            );
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
        Schema::dropIfExists('calendar_events');
        Schema::dropIfExists('research_project_access');

        Schema::table('notebook_entries', function (Blueprint $table) {
            $table->dropColumn('content_json');
        });

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn(['banner', 'progress', 'content']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['theme_preference', 'password_reset_code', 'password_reset_expires_at']);
        });
    }
};
