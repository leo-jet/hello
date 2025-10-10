import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseMsalApiService } from './base-msal-api.service';
import { ApiResponse, User } from '@app/models';

/**
 * Microsoft Graph API Service
 * Example service using BaseMsalApiService to interact with Microsoft Graph API
 * 
 * This service demonstrates how to use MSAL authentication with different endpoints
 * and scope configurations.
 */
@Injectable({
  providedIn: 'root'
})
export class MsGraphApiService extends BaseMsalApiService {
  
  // Microsoft Graph API base URL
  private readonly graphBaseUrl = 'https://graph.microsoft.com/v1.0';

  /**
   * Get current user profile from Microsoft Graph
   * Scope: User.Read (default)
   */
  getMyProfile(): Observable<ApiResponse<User>> {
    return this.getMsal<User>(`${this.graphBaseUrl}/me`);
  }

  /**
   * Get user profile by ID
   * Scope: User.Read.All
   */
  getUserById(userId: string): Observable<ApiResponse<User>> {
    return this.getMsal<User>(
      `${this.graphBaseUrl}/users/${userId}`,
      { scopes: ['User.Read.All'] }
    );
  }

  /**
   * Get all users in the organization
   * Scope: User.Read.All
   */
  getAllUsers(): Observable<ApiResponse<User[]>> {
    return this.getMsal<User[]>(
      `${this.graphBaseUrl}/users`,
      { scopes: ['User.Read.All'] }
    );
  }

  /**
   * Update current user profile
   * Scope: User.ReadWrite
   */
  updateMyProfile(userData: Partial<User>): Observable<ApiResponse<User>> {
    return this.patchMsal<User>(
      `${this.graphBaseUrl}/me`,
      userData,
      { scopes: ['User.ReadWrite'] }
    );
  }

  /**
   * Get user's photo
   * Scope: User.Read
   */
  getMyPhoto(): Observable<Blob> {
    // Note: For binary data, you might need to use HttpClient directly
    // This is a placeholder showing the pattern
    return this.getMsal<any>(`${this.graphBaseUrl}/me/photo/$value`).pipe(
      // Transform to Blob if needed
    ) as any;
  }

  /**
   * Get user's mail messages
   * Scope: Mail.Read
   */
  getMyMail(): Observable<ApiResponse<any[]>> {
    return this.getMsal<any[]>(
      `${this.graphBaseUrl}/me/messages`,
      { scopes: ['Mail.Read'] }
    );
  }

  /**
   * Send mail
   * Scope: Mail.Send
   */
  sendMail(mailData: any): Observable<ApiResponse<void>> {
    return this.postMsal<void>(
      `${this.graphBaseUrl}/me/sendMail`,
      mailData,
      { scopes: ['Mail.Send'] }
    );
  }

  /**
   * Get user's calendar events
   * Scope: Calendars.Read
   */
  getMyCalendar(): Observable<ApiResponse<any[]>> {
    return this.getMsal<any[]>(
      `${this.graphBaseUrl}/me/events`,
      { scopes: ['Calendars.Read'] }
    );
  }

  /**
   * Create calendar event
   * Scope: Calendars.ReadWrite
   */
  createCalendarEvent(eventData: any): Observable<ApiResponse<any>> {
    return this.postMsal<any>(
      `${this.graphBaseUrl}/me/events`,
      eventData,
      { scopes: ['Calendars.ReadWrite'] }
    );
  }

  /**
   * Get user's OneDrive files
   * Scope: Files.Read
   */
  getMyFiles(): Observable<ApiResponse<any[]>> {
    return this.getMsal<any[]>(
      `${this.graphBaseUrl}/me/drive/root/children`,
      { scopes: ['Files.Read'] }
    );
  }

  /**
   * Upload file to OneDrive
   * Scope: Files.ReadWrite
   */
  uploadFileToOneDrive(fileName: string, fileContent: any): Observable<ApiResponse<any>> {
    return this.putMsal<any>(
      `${this.graphBaseUrl}/me/drive/root:/${fileName}:/content`,
      fileContent,
      { scopes: ['Files.ReadWrite'] }
    );
  }

  /**
   * Get user's Teams
   * Scope: Team.ReadBasic.All
   */
  getMyTeams(): Observable<ApiResponse<any[]>> {
    return this.getMsal<any[]>(
      `${this.graphBaseUrl}/me/joinedTeams`,
      { scopes: ['Team.ReadBasic.All'] }
    );
  }

  /**
   * Get group members
   * Scope: Group.Read.All
   */
  getGroupMembers(groupId: string): Observable<ApiResponse<User[]>> {
    return this.getMsal<User[]>(
      `${this.graphBaseUrl}/groups/${groupId}/members`,
      { scopes: ['Group.Read.All'] }
    );
  }

  /**
   * Search users
   * Scope: User.Read.All
   */
  searchUsers(searchQuery: string): Observable<ApiResponse<User[]>> {
    return this.getMsal<User[]>(
      `${this.graphBaseUrl}/users?$search="displayName:${searchQuery}"`,
      { 
        scopes: ['User.Read.All'],
        forceRefresh: false 
      }
    );
  }

  /**
   * Get user's presence (online status)
   * Scope: Presence.Read
   */
  getMyPresence(): Observable<ApiResponse<any>> {
    return this.getMsal<any>(
      `${this.graphBaseUrl}/me/presence`,
      { scopes: ['Presence.Read'] }
    );
  }

  /**
   * Get organization details
   * Scope: Organization.Read.All
   */
  getOrganization(): Observable<ApiResponse<any>> {
    return this.getMsal<any>(
      `${this.graphBaseUrl}/organization`,
      { scopes: ['Organization.Read.All'] }
    );
  }

  /**
   * Force token refresh and get profile
   * Useful when you need the latest data and want to bypass cache
   */
  getMyProfileWithRefresh(): Observable<ApiResponse<User>> {
    return this.getMsal<User>(
      `${this.graphBaseUrl}/me`,
      { 
        scopes: ['User.Read'],
        forceRefresh: true 
      }
    );
  }

  /**
   * Batch multiple Graph API requests
   * Scope: Multiple scopes as needed
   */
  batchRequests(requests: any[]): Observable<ApiResponse<any>> {
    return this.postMsal<any>(
      `${this.graphBaseUrl}/$batch`,
      { requests },
      { scopes: ['User.Read', 'Mail.Read', 'Calendars.Read'] }
    );
  }
}
