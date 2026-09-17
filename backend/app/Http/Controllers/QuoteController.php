<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class QuoteController extends Controller
{
    public function show()
    {
        return response()->json($this->selectQuote(false));
    }

    public function newQuote()
    {
        return response()->json($this->selectQuote(true));
    }

    private function selectQuote(bool $force): Quote
    {
        $today = now()->toDateString();
        $selection = DB::table('user_quote_selections')->where('user_id', Auth::id())->where('selected_on', $today)->first();
        if ($selection && ! $force) return Quote::findOrFail($selection->quote_id);

        $used = DB::table('user_quote_selections')->where('user_id', Auth::id())->pluck('quote_id');
        $quote = Quote::whereNotIn('id', $used)->inRandomOrder()->first() ?? Quote::inRandomOrder()->firstOrFail();
        DB::table('user_quote_selections')->updateOrInsert(
            ['user_id' => Auth::id(), 'selected_on' => $today],
            ['quote_id' => $quote->id, 'updated_at' => now(), 'created_at' => now()],
        );

        return $quote;
    }
}