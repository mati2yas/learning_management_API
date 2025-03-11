<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    public function saves(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Save::class);
    }

    public function likes(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function paidCourses(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PaidCourse::class);
    }

    public function paidExams(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PaidExam::class);
    }

    // Relationship for the user who created this user
    public function creator(){
        return $this->belongsTo(User::class,'created_by');
    }

    // Relationship for the user who last updated this user
    public function updater(){
        return $this->belongsTo(User::class,'updated_by');
    }

    public function createdCourses(){
        return $this->hasMany(Course::class,'created_by');
    }

    public function updatedCourses(){
        return $this->hasMany(Course::class,'updated_by');
    }

    public function createdChapters(){
        return $this->hasMany(Chapter::class,'created_by');
    }

    public function updatedChapters(){
        return $this->hasMany(Chapter::class,'updated_by');
    }

    public function createdContents(){
        return $this->hasMany(Content::class,'created_by');
    }

    public function updatedContents(){
        return $this->hasMany(Content::class,'updated_by');
    }

    public function createdQuizzes(){
        return $this->hasMany(Quiz::class,'created_by');
    }

    public function updatedQuizzes(){
        return $this->hasMany(Quiz::class,'updated_by');
    }

    public function createdQuizQuestions(){
        return $this->hasMany(QuizQuestion::class,'created_by');
    }

    public function updatedQuizQuestions(){
        return $this->hasMany(QuizQuestion::class,'updated_by');
    }

    public function createdExamQuestions(){
        return $this->hasMany(ExamQuestion::class,'created_by');
    }

    public function updatedExamQuestions(){
        return $this->hasMany(ExamQuestion::class,'updated_by');
    }

    public function subscriptionRequests(){
        return $this->hasMany(SubscriptionRequest::class);
    }

    public function bannedUser(){
        return $this->hasOne(BannedUser::class);
    }

    

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}


