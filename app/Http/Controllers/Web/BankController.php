<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use Illuminate\Http\Request;

class BankController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $attrs = $request->validate([
            'bank_name' => 'required|string|max:255',
            'bank_account_number' => 'required|numeric|digits_between:6,20|unique:banks,bank_account_number',
        ]);

        Bank::create($attrs);

        return redirect()->route('dashboard')->with('success', 'Bank created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bank $bank)
    {
        $attrs = $request->validate([
            'bank_name' => 'required|string|max:255',
            'bank_account_number' => 'required|numeric|digits_between:6,20|unique:banks,bank_account_number,' . $bank->id,
        ]);

        $bank->update($attrs);

        return redirect()->route('dashboard')->with('success', 'Bank updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bank $bank)
    {
        $bank->delete();

        return redirect()->route('dashboard')->with('success', 'Bank deleted successfully.');
    }
}
