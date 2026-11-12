"use client";
import { toast } from "@/components/ui/toast";
import { applyJob } from "@/lib/actions/jobs";
import { getApplicationsCount } from "@/lib/api/applications";
import { useSession } from "@/lib/auth-client";
import { JobRecord, Role, type ApplicationDataType } from "@/lib/types";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobActions({ job }: { job: JobRecord }) {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;
  const role = (user as { role?: Role } | undefined)?.role ?? "seeker";
  const handleApplyNow = async () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`);
      return;
    }
    if (role === "seeker") {
      // number of jobs applied by this user
      const countResult = await getApplicationsCount(`userId=${user.id}`);
      if (countResult.count >= 10) {
        router.push('/payment')
        return;
      } else {
        const application: ApplicationDataType = {
          jobId: job._id,
          userId: user.id,
          email: user.email,
          jobTitle: job.title,
          companyName: job.company,
          jobType: job.jobType,
          category: job.category,
          isRemote: job.isRemote,
          location: job.location,
          status: "Applied",
          appliedAt: new Date().toISOString(),
        };
        const result = await applyJob(application);
        if (result.insertedId) {
          toast.add({
            title: "Job applied Successfully!",
            type: "success",
          });
          router.push("/browse-jobs");
        }
      }
    } 
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="rounded-lg border border-[#303238] bg-[#1A1C21] p-2.5 text-gray-300 transition hover:bg-[#252830] hover:text-white"
      >
        <Bookmark className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={handleApplyNow}
        className="rounded-lg bg-white px-3.5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
      >
        Apply Now
      </button>
    </div>
  );
}
