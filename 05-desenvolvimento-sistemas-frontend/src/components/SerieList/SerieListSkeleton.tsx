"use client";

import { Card, CardContent, Box, Skeleton } from "@mui/material";

export default function SerieListSkeleton() {
  // We can render 6 card skeletons to simulate a full page load nicely
  const skeletonItems = Array.from({ length: 6 });

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
      data-testid="serie-list-skeleton"
    >
      {skeletonItems.map((_, index) => (
        <Card 
          key={index} 
          className="relative overflow-hidden shadow-sm"
          sx={{ borderTop: "6px solid #e2e8f0", bgcolor: 'background.paper' }}
        >
          <CardContent className="flex flex-col h-full gap-4">
            {/* Title Skeleton */}
            <Skeleton variant="text" width="70%" height={32} />

            {/* Chips and Stars Box */}
            <Box className="flex items-center gap-2 justify-between flex-wrap">
              <Box className="flex gap-2">
                <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
                <Skeleton variant="rectangular" width={90} height={24} className="rounded-full" />
              </Box>
              <Skeleton variant="rectangular" width={80} height={18} />
            </Box>

            {/* Info Lines Skeletons */}
            <Box className="flex flex-col gap-2 flex-grow mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Box key={i} className="flex items-center gap-2">
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={i % 2 === 0 ? "55%" : "45%"} />
                </Box>
              ))}
            </Box>

            {/* Action Buttons Skeleton */}
            <Box className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton variant="circular" width={28} height={28} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
