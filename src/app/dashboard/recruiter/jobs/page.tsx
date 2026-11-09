"use client";

export type JobDataType = {
  title: string;
  company: string;
  category: string;
  jobType: string;
  isRemote: boolean;
  location: string;
  deadline: string;
  minSalary: string;
  maxSalary: string;
  salaryType: string;
  description: string;
  responsibilities: string;
  requirements: string;
};

import { useState } from "react";
import { Globe, MapPin, Calendar } from "lucide-react";
import { createJob } from "@/lib/actions/jobs";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const AddJobsPage = () => {
  const [jobType, setJobType] = useState("Full-time");
  const [isRemote, setIsRemote] = useState(false);
  const router = useRouter()
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const jobData: JobDataType = {
      title: String(data.title ?? ""),
      company: String(data.company ?? ""),
      category: String(data.category ?? ""),
      jobType,
      isRemote,
      location: String(data.location ?? ""),
      deadline: String(data.deadline ?? ""),
      minSalary: String(data.minSalary ?? ""),
      maxSalary: String(data.maxSalary ?? ""),
      salaryType: String(data.salaryType ?? ""),
      description: String(data.description ?? ""),
      responsibilities: String(data.responsibilities ?? ""),
      requirements: String(data.requirements ?? ""),
    };
    const result = await createJob(jobData);
    if(result.insertedId){
      toast.add({
        title: "Job added Successfully!",
        type: "success",
      });
    }else{
      toast.add({
        title: "Something went wrong!",
      });
    }
    router.push('/dashboard/recruiter/manage-jobs')
  };

  return (
    <div className="min-h-screen bg-[#090A0C] p-4 text-white md:p-8">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 border-b border-[#22252A] pb-6">
          <p className="mb-2 text-xs text-gray-500">
            Manage Jobs / Create New Listing
          </p>

          <h1 className="text-3xl font-bold">Post a New Job</h1>

          <p className="mt-2 text-sm text-gray-500">
            Fill in the details to create a new job listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* 1. Basic Information */}
          <section className="space-y-5">
            <h2 className="font-semibold text-indigo-500">
              1. Basic Information
            </h2>

            {/* Job Title */}
            <div>
              <label>Job Title *</label>
              <input
                name="title"
                type="text"
                placeholder="Frontend Developer"
                className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-3 py-3 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Company Name */}
              <div>
                <label>Company Name *</label>
                <input
                  name="company"
                  type="text"
                  placeholder="Company Name"
                  className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-3 py-3 text-sm outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label>Job Category *</label>
                <select
                  name="category"
                  className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-3 py-3 text-sm outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Engineering & Tech">Engineering & Tech</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                </select>
              </div>
            </div>

            {/* Job Type */}
            <div>
              <label>Job Type *</label>

              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {jobTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setJobType(type)}
                    className={`rounded-lg border p-3 text-sm ${
                      jobType === type
                        ? "border-indigo-500 bg-indigo-500/20 text-white"
                        : "border-[#22252A] text-gray-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Location & Compensation */}
          <section className="space-y-5">
            <h2 className="font-semibold text-indigo-500">
              2. Location & Compensation
            </h2>

            {/* Remote Work */}
            <div className="flex items-center justify-between rounded-lg border border-[#22252A] bg-[#121316] p-4">
              <div className="flex items-center gap-3">
                <Globe className="text-indigo-500" />

                <div>
                  <p className="font-medium">Remote Work Allowed</p>
                  <p className="text-xs text-gray-500">
                    Allow candidates to work remotely.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
                className="h-5 w-5 accent-indigo-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* Location */}
              <div>
                <label>Job Location</label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-5 h-4 w-4 text-gray-500" />

                  <input
                    name="location"
                    type="text"
                    placeholder="New York, USA"
                    className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label>Application Deadline</label>

                <div className="relative">
                  <Calendar className="absolute left-3 top-5 h-4 w-4 text-gray-500" />

                  <input
                    name="deadline"
                    type="date"
                    className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="grid grid-cols-3 gap-3">

              <div>
                <label>Minimum Salary</label>
                <input
                  name="minSalary"
                  type="number"
                  placeholder="25"
                  className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-3 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label>Maximum Salary</label>
                <input
                  name="maxSalary"
                  type="number"
                  placeholder="40"
                  className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-3 py-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label>Frequency</label>
                <select
                  name="salaryType"
                  className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-2 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="Per hour">Per hour</option>
                  <option value="Per month">Per month</option>
                  <option value="Per year">Per year</option>
                </select>
              </div>
            </div>
          </section>

          {/* 3. Responsibilities & Requirements */}
          <section className="space-y-5">
            <h2 className="font-semibold text-indigo-500">
              3. Responsibilities & Requirements
            </h2>

            {/* Description */}
            <div>
              <label>Job Description *</label>
              <textarea
                name="description"
                rows={5}
                placeholder="Describe the job..."
                className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-3 py-3 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label>Responsibilities *</label>
              <textarea
                name="responsibilities"
                rows={4}
                placeholder="Enter job responsibilities..."
                className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-3 py-3 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* Requirements */}
            <div>
              <label>Requirements *</label>
              <textarea
                name="requirements"
                rows={4}
                placeholder="Enter job requirements..."
                className="mt-2 w-full rounded-lg border border-[#22252A] bg-[#121316] px-3 py-3 text-sm outline-none focus:border-indigo-500"
                required
              />
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold transition hover:bg-indigo-700"
          >
            Publish Job →
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddJobsPage;
