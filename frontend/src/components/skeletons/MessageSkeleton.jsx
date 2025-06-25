const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        <div
          key={idx}
          className={`chat ${idx % 2 === 0 ? 'chat-start' : 'chat-end'}`}
        >
          <div className="chat-image avatar">
            <div className="w-10 h-10 rounded-full skeleton bg-base-200" />
          </div>

          <div className="chat-header mb-1">
            <div className="h-4 w-16 rounded skeleton bg-base-200" />
          </div>

          <div className="chat-bubble bg-base-200 p-2 rounded">
            <div className="h-6 w-[200px] skeleton bg-base-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
