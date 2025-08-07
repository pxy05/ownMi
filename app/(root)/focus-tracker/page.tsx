"use client";
import React from "react";
import { useAppUser } from "@/lib/app-user-context";

function calculateHourlyRate(salary: number): number {
  return salary / 1703;
}

const page = () => {
  const { appUser, loading, exists, error } = useAppUser();
  const hourlyRate = appUser
    ? calculateHourlyRate(parseInt(appUser.current_salary))
    : 0;
  return <div>Hourly Rate: {hourlyRate}</div>;
};

export default page;
