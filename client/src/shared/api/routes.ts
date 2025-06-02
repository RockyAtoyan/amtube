export const ROUTES = {
  auth: {
    signUp: {
      path: "/auth/sign-up",
      method: "post",
    },
    activateAccount: {
      path: "/auth/activate",
      method: "get",
    },
    sendActivateEmail: {
      path: "/auth/send-email",
      method: "get",
    },
    signIn: {
      path: "/auth/sign-in",
      method: "post",
    },
    profile: {
      path: "/auth/profile",
      method: "get",
    },
    logout: {
      path: "/auth/logout",
      method: "post",
    },
    refreshAccessToken: {
      path: "/auth/access-token",
      method: "get",
    },
  },
  answers: {
    create: {
      path: "/answers",
      method: "post",
    },
    findAll: {
      path: "/answers",
      method: "get",
    },
    findOne: {
      path: "/answers",
      method: "get",
    },
    toggleLike: {
      path: "/answers/likes",
      method: "patch",
    },
    update: {
      path: "/answers",
      method: "patch",
    },
    delete: {
      path: "/answers",
      method: "delete",
    },
  },
  channels: {
    create: {
      path: "/channels",
      method: "post",
    },
    findAll: {
      path: "/channels",
      method: "get",
    },
    findById: {
      path: "/channels",
      method: "get",
    },
    findBySlug: {
      path: "/channels/slug",
      method: "get",
    },
    update: {
      path: "/channels",
      method: "patch",
    },
    delete: {
      path: "/channels",
      method: "delete",
    },
  },
  comments: {
    create: {
      path: "/comments",
      method: "post",
    },
    findAll: {
      path: "/comments/v",
      method: "get",
    },
    findOne: {
      path: "/comments",
      method: "get",
    },
    toggleLike: {
      path: "/comments/likes",
      method: "patch",
    },
    update: {
      path: "/comments",
      method: "patch",
    },
    delete: {
      path: "/comments",
      method: "delete",
    },
  },
  media: {
    upload: {
      path: "/media/upload",
      method: "post",
    },
  },
  notifications: {
    create: {
      path: "/notifications",
      method: "post",
    },
    update: {
      path: "/notifications",
      method: "patch",
    },
    delete: {
      path: "/notifications",
      method: "delete",
    },
  },
  playlists: {
    create: {
      path: "/playlists",
      method: "post",
    },
    findAll: {
      path: "/playlists",
      method: "get",
    },
    findOne: {
      path: "/playlists",
      method: "get",
    },
    toggleSavePlaylist: {
      path: "/playlists/saved",
      method: "patch",
    },
    toggleVideoToPlaylist: {
      path: "/playlists/added",
      method: "patch",
    },
    update: {
      path: "/playlists",
      method: "patch",
    },
    delete: {
      path: "/playlists",
      method: "delete",
    },
  },
  tags: {
    create: {
      path: "/tags",
      method: "post",
    },
    findAll: {
      path: "/tags",
      method: "get",
    },
    findOne: {
      path: "/tags",
      method: "get",
    },
    delete: {
      path: "/tags",
      method: "delete",
    },
  },
  users: {
    create: {
      path: "/users",
      method: "post",
    },
    findById: {
      path: "/users",
      method: "get",
    },
    findByEmail: {
      path: "/users/email",
      method: "get",
    },
    findBySlug: {
      path: "/users/name",
      method: "get",
    },
    getUserHistory: {
      path: "/users/history",
      method: "get",
    },
    getUserSubscribesVideos: {
      path: "/users/subscribes",
      method: "get",
    },
    getUserLikedVideos: {
      path: "/users/liked",
      method: "get",
    },
    update: {
      path: "/users",
      method: "patch",
    },
    banUser: {
      path: "/users/ban",
      method: "patch",
    },
    addVideoToHistory: {
      path: "/users/add-video-to-history",
      method: "patch",
    },
    toggleChannelSubscribe: {
      path: "/users/toggle-channel-subscribe",
      method: "patch",
    },
    delete: {
      path: "/users",
      method: "delete",
    },
  },
  videos: {
    processVideoFile: {
      path: "/videos/process",
      method: "post",
    },
    sse: {
      path: "/videos/stream-notifications",
      method: "get",
    },
    findAll: {
      path: "/videos",
      method: "get",
    },
    getTrending: {
      path: "/videos/trending",
      method: "get",
    },
    getExplore: {
      path: "/videos/explore",
      method: "get",
    },
    findOne: {
      path: "/videos",
      method: "get",
    },
    findSimilar: {
      path: "/videos/similar",
      method: "get",
    },
    update: {
      path: "/videos",
      method: "patch",
    },
    delete: {
      path: "/videos",
      method: "delete",
    },
  },
};
