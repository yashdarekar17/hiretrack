import React from "react";
import {
  CalendarDays,
  User,
  Clock,
  Video,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { getInterviews } from "@/server/queries/interview";
import { getCandidates } from "@/server/queries/candidate";
import { ScheduleDialog } from "@/components/interviews/schedule-dialog";
import { ScorecardDialog } from "@/components/interviews/scorecard-dialog";
import { DeleteInterviewButton } from "@/components/interviews/delete-interview-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

// Helper to format date strings nicely
const formatInterviewDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const formatInterviewTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Helper for scorecard rating colors
const getRatingStyles = (rating: number) => {
  if (rating >= 4) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50";
  if (rating <= 2) return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200/50";
  return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200/50";
};

// ──────────────────────────────────────────────────────────────
// InterviewsPage (Server Component)
// ──────────────────────────────────────────────────────────────
// Fetches scheduled interviews and candidates list in parallel.
// Renders the scheduling triggers, scorecard dialog inputs,
// and card lists of upcoming and past meetings.
// ──────────────────────────────────────────────────────────────
export default async function InterviewsPage() {
  // Fetch data in parallel
  const [interviews, candidates] = await Promise.all([
    getInterviews(),
    getCandidates(),
  ]);

  // Split interviews into upcoming vs past
  const now = new Date();
  const upcomingInterviews = interviews.filter((i) => new Date(i.scheduledAt) >= now);
  const pastInterviews = interviews.filter((i) => new Date(i.scheduledAt) < now);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Interview Schedule
          </h2>
          <p className="text-muted-foreground mt-1">
            Schedule candidate meetings, review interview panels, and complete candidate evaluations.
          </p>
        </div>
        <ScheduleDialog candidates={candidates} />
      </div>

      {/* ── Grid: Upcoming & Past Sections ── */}
      <div className="grid gap-6">
        {/* ── Upcoming Interviews Section ── */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            Upcoming Evaluations ({upcomingInterviews.length})
          </h3>

          {upcomingInterviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingInterviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="border border-border/60 bg-card rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  <CardHeader className="border-b border-border/20 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base font-bold">
                          {interview.candidate.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5 truncate max-w-[170px]">
                          {interview.candidate.email}
                        </CardDescription>
                      </div>
                      <DeleteInterviewButton id={interview.id} candidateName={interview.candidate.name} />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-4 flex-1">
                    {/* Date Info */}
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary/70" />
                      <div>
                        <span className="font-semibold text-foreground block">
                          {formatInterviewDate(interview.scheduledAt)}
                        </span>
                        <span className="text-xs">
                          {formatInterviewTime(interview.scheduledAt)}
                        </span>
                      </div>
                    </div>

                    {/* Interviewer */}
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <User className="w-4 h-4 text-primary/70" />
                      <span>Interviewer: <strong className="text-foreground">{interview.interviewer}</strong></span>
                    </div>

                    {/* Meeting Link */}
                    {interview.meetingLink && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Video className="w-4 h-4 text-primary/70" />
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium inline-flex items-center gap-1.5"
                        >
                          Join Meeting
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t border-border/20 px-6 py-3 bg-neutral-50/50 dark:bg-background/15 flex justify-end">
                    <ScorecardDialog
                      interviewId={interview.id}
                      candidateName={interview.candidate.name}
                      initialScorecard={interview.scorecard}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border/60 rounded-2xl py-12 px-4 text-center">
              <div className="p-3.5 bg-muted rounded-full text-muted-foreground w-fit mx-auto mb-3.5">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-foreground">No upcoming interviews</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">
                Arrange a technical review or phone screening for candidates to keep pipelines moving.
              </p>
            </div>
          )}
        </div>

        {/* ── Past Evaluations Section ── */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Past Evaluations ({pastInterviews.length})
          </h3>

          {pastInterviews.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastInterviews.map((interview) => (
                <Card
                  key={interview.id}
                  className="border border-border/60 bg-card rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between opacity-85 hover:opacity-100 transition-opacity"
                >
                  <CardHeader className="border-b border-border/20 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base font-bold">
                          {interview.candidate.name}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          {interview.candidate.email}
                        </CardDescription>
                      </div>
                      <DeleteInterviewButton id={interview.id} candidateName={interview.candidate.name} />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3.5 pt-4 flex-1">
                    {/* Date Info */}
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <div>
                        <span className="font-medium text-foreground block">
                          {formatInterviewDate(interview.scheduledAt)}
                        </span>
                        <span className="text-xs">
                          {formatInterviewTime(interview.scheduledAt)}
                        </span>
                      </div>
                    </div>

                    {/* Interviewer */}
                    <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Interviewer: {interview.interviewer}</span>
                    </div>

                    {/* Scorecard Results summary */}
                    {interview.scorecard && (
                      <div className="pt-2 border-t border-dashed border-border/60 space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                          Evaluation Scores:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`text-[0.7rem] px-2 py-0.5 rounded-md font-semibold border ${getRatingStyles(interview.scorecard.technicalRating)}`}>
                            Tech: {interview.scorecard.technicalRating}/5
                          </span>
                          <span className={`text-[0.7rem] px-2 py-0.5 rounded-md font-semibold border ${getRatingStyles(interview.scorecard.communicationRating)}`}>
                            Comm: {interview.scorecard.communicationRating}/5
                          </span>
                          <span className={`text-[0.7rem] px-2 py-0.5 rounded-md font-semibold border ${getRatingStyles(interview.scorecard.problemSolvingRating)}`}>
                            Solve: {interview.scorecard.problemSolvingRating}/5
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t border-border/20 px-6 py-3 bg-neutral-50/50 dark:bg-background/15 flex justify-end">
                    <ScorecardDialog
                      interviewId={interview.id}
                      candidateName={interview.candidate.name}
                      initialScorecard={interview.scorecard}
                    />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border/60 rounded-2xl py-8 px-4 text-center">
              <p className="text-xs text-muted-foreground italic">No historical evaluations to display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
