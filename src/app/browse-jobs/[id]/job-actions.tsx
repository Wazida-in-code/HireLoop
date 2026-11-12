"use client";
import { useSession } from "@/lib/auth-client";
import { JobRecord } from "@/lib/types";
import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobActions({ job }: { job: JobRecord }) {
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;
  const handleApplyNow = () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${job._id}`);
      return;
    }
    else{
      console.log("Do next");
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
        type="button" onClick={handleApplyNow}
        className="rounded-lg bg-white px-3.5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
      >
        Apply Now
      </button>
    </div>
  );
}
