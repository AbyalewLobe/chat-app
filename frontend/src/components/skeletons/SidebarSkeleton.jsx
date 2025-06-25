import { Users } from 'lucide-react';

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
      flex flex-col transition-all duration-200 bg-base-100"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3 space-y-4">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full px-4 flex items-center gap-3 animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full bg-base-200" />
            </div>

            {/* User info skeleton */}
            <div className="hidden lg:block text-left min-w-0 flex-1 space-y-1">
              <div className="skeleton h-4 w-32 bg-base-200 rounded" />
              <div className="skeleton h-3 w-16 bg-base-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
