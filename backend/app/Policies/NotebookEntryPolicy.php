<?php

namespace App\Policies;

use App\Models\NotebookEntry;
use App\Models\ResearchProjectAccess;
use App\Models\User;

class NotebookEntryPolicy
{
    public function view(User $user, NotebookEntry $entry): bool
    {
        if ($entry->user_id === $user->id) {
            return true;
        }

        // If note is linked to a project, check if user has access to that project
        if ($entry->project_id && $entry->project) {
            return $entry->project->user_id === $user->id ||
                $entry->project->accessList()->where('user_id', $user->id)->exists();
        }

        return false;
    }

    public function update(User $user, NotebookEntry $entry): bool
    {
        if ($entry->user_id === $user->id) {
            return true;
        }

        if ($entry->project_id && $entry->project) {
            $access = $entry->project->accessList()
                ->where('user_id', $user->id)
                ->first();
            return $access && $access->access_level >= ResearchProjectAccess::LEVEL_EDIT;
        }

        return false;
    }

    public function delete(User $user, NotebookEntry $entry): bool
    {
        return $entry->user_id === $user->id;
    }
}
