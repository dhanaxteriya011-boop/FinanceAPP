<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Check if user exists and is admin
        if (!$user || (int) $user->is_admin !== 1) {
            return response()->json([
                'message' => 'Forbidden. Admins only.'
            ], 403);
        }

        return $next($request);
    }
}