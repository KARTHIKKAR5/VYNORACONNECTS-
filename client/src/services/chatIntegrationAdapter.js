/**
 * Vynora Connect — Teams & Projects Module
 * Adapter: Siri's Communication & Chat Module Integration
 *
 * Coordinates real-time group communication by registering canonical team IDs
 * and dispatching membership change events to update chat channel authorizations.
 */

export const CHAT_EVENT_TYPES = {
  TEAM_CHAT_INITIALIZED: 'TEAM_CHAT_INITIALIZED',
  MEMBER_AUTHORIZED: 'MEMBER_AUTHORIZED',
  MEMBER_DEAUTHORIZED: 'MEMBER_DEAUTHORIZED',
};

class ChatIntegrationAdapter {
  constructor() {
    this.registeredRooms = new Map();
    this.eventLog = [];
  }

  /**
   * Initialize a team chat room when a project team is formed
   */
  initializeTeamChatRoom(teamId, projectId, projectTitle, memberUserIds) {
    const roomRecord = {
      channelId: `chat-team-${teamId}`,
      teamId,
      projectId,
      projectTitle,
      authorizedUserIds: [...memberUserIds],
      createdAt: new Date().toISOString(),
    };

    this.registeredRooms.set(teamId, roomRecord);
    this.logEvent(CHAT_EVENT_TYPES.TEAM_CHAT_INITIALIZED, {
      teamId,
      channelId: roomRecord.channelId,
      authorizedUserIds: roomRecord.authorizedUserIds,
    });

    return roomRecord;
  }

  /**
   * Dispatch member authorization event when an applicant is accepted
   */
  authorizeMemberInChat(teamId, userId) {
    const room = this.registeredRooms.get(teamId);
    if (room && !room.authorizedUserIds.includes(userId)) {
      room.authorizedUserIds.push(userId);
    }
    this.logEvent(CHAT_EVENT_TYPES.MEMBER_AUTHORIZED, { teamId, userId });
  }

  /**
   * Dispatch member deauthorization event when a member is removed or leaves
   */
  deauthorizeMemberInChat(teamId, userId) {
    const room = this.registeredRooms.get(teamId);
    if (room) {
      room.authorizedUserIds = room.authorizedUserIds.filter(id => id !== userId);
    }
    this.logEvent(CHAT_EVENT_TYPES.MEMBER_DEAUTHORIZED, { teamId, userId });
  }

  /**
   * Generate safe navigation route into Siri's chat module
   */
  getChatRoomUrl(teamId) {
    return `/chat?channel=team&teamId=${encodeURIComponent(teamId)}`;
  }

  logEvent(eventType, payload) {
    this.eventLog.push({
      eventType,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  getEventLog() {
    return [...this.eventLog];
  }
}

export const chatIntegrationAdapter = new ChatIntegrationAdapter();

