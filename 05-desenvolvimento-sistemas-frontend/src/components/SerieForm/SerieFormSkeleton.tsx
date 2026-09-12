"use client";

import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function SerieFormSkeleton() {
  return (
    <Card className="max-w-3xl mx-auto shadow-lg" data-testid="serie-form-skeleton">
      <CardContent className="p-8">
        <Box className="flex flex-col gap-6">
          {/* Row 1: Title and Seasons */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Box className="md:col-span-8">
              <Skeleton variant="rectangular" height={56} className="rounded-md" />
            </Box>
            <Box className="md:col-span-4">
              <Skeleton variant="rectangular" height={56} className="rounded-md" />
            </Box>
          </div>

          {/* Row 2: Category, Release Date, Watched Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton variant="rectangular" height={56} className="rounded-md" />
            <Skeleton variant="rectangular" height={56} className="rounded-md" />
            <Skeleton variant="rectangular" height={56} className="rounded-md" />
          </div>

          {/* Row 3: Director and Producer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton variant="rectangular" height={56} className="rounded-md" />
            <Skeleton variant="rectangular" height={56} className="rounded-md" />
          </div>

          {/* Row 4: Rating and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Box className="flex flex-col gap-2">
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="rectangular" width={150} height={28} className="rounded-md" />
            </Box>
            <Skeleton variant="rectangular" height={56} className="rounded-md" />
          </div>

          {/* Alert skeleton */}
          <Skeleton variant="rectangular" height={48} className="rounded-md my-2" />

          {/* Buttons cancel and save */}
          <Box className="flex justify-end gap-4 mt-4">
            <Skeleton variant="rectangular" width={100} height={36} className="rounded-md" />
            <Skeleton variant="rectangular" width={140} height={36} className="rounded-md" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
