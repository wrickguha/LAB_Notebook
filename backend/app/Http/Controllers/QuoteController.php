<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuoteController extends Controller
{
    public function show()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json($this->selectDeterministicQuote(false));
    }

    public function newQuote()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json($this->selectDeterministicQuote(true));
    }

    private function selectDeterministicQuote(bool $force): array
    {
        $today = now()->toDateString();
        $userId = Auth::id();

        // If user already had a manual quote selected today and not forcing new
        $selection = DB::table('user_quote_selections')
            ->where('user_id', $userId)
            ->where('selected_on', $today)
            ->first();

        if ($selection && ! $force) {
            $existing = Quote::find($selection->quote_id);
            if ($existing) {
                return [
                    'id'     => $existing->id,
                    'quote'  => $existing->quote,
                    'author' => $existing->author,
                ];
            }
        }

        $count = Quote::count();
        if ($count === 0) {
            return [
                'id'     => 1,
                'quote'  => 'Research is formalized curiosity. It is poking and prying with a purpose.',
                'author' => 'Zora Neale Hurston',
            ];
        }

        if ($force) {
            // Pick a random quote that isn't the current one
            $currentId = $selection?->quote_id ?? 0;
            $quote = Quote::where('id', '!=', $currentId)->inRandomOrder()->first() ?? Quote::first();
        } else {
            // Deterministic calculation: day of year + year salt mapped across all quotes
            $dayOfYear = (int) now()->format('z');
            $year = (int) now()->format('Y');
            $index = ($dayOfYear + ($year * 17)) % $count;
            $quote = Quote::orderBy('id')->skip($index)->first() ?? Quote::first();
        }

        if ($userId && $quote) {
            DB::table('user_quote_selections')->updateOrInsert(
                ['user_id' => $userId, 'selected_on' => $today],
                ['quote_id' => $quote->id, 'updated_at' => now(), 'created_at' => now()]
            );
        }

        return [
            'id'     => $quote->id,
            'quote'  => $quote->quote,
            'author' => $quote->author,
        ];
    }
}