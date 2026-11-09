"use client";
import { Trash2, Trash2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DeleteJobData } from "@/lib/actions/jobs";
import { JobRecord } from "@/lib/types";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export function DeleteJob({ job }: { job: JobRecord }) {
  const router = useRouter()
  const [open, setOpen] = useState(false);
  const handleDelete = async () => {
    const res = await DeleteJobData({ id: job._id });
    console.log(job._id, res);
    if (res.deletedCount) {
      setOpen(false);
      toast.add({
        title: "Job Deleted Successfully!",
        type: "success",
      });
      router.refresh()
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <button
            type="button"
            aria-label={`Delete ${job.title}`}
            className="rounded-lg border border-[#22252A] bg-[#121316] p-2 text-gray-400 transition hover:border-red-500/40 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        }
      />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this job?</AlertDialogTitle>
          <AlertDialogDescription>Are you sure?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
