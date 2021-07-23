import * as Option from './option'
import * as Entity from './entity'
import Request from './request'

export default class Backlog extends Request {
    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-space/
     */
    async getSpace(): Promise<any> {
        return this.get('space')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-recent-updates/
     */
    async getSpaceActivities(params: Option.Space.GetActivitiesParams): Promise<any> {
        return this.get('space/activities', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-space-logo/
     */
    async getSpaceIcon(): Promise<Entity.File.FileData> {
        return this.download('space/image')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-space-notification/
     */
    async getSpaceNotification(): Promise<any> {
        return this.get('space/notification')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-space-notification/
     */
    async putSpaceNotification(params: Option.Space.PutSpaceNotificationParams): Promise<any> {
        return this.put('space/notification', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-space-disk-usage/
     */
    async getSpaceDiskUsage(): Promise<any> {
        return this.get('space/diskUsage')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/post-attachment-file/
     */
    async postSpaceAttachment(form: FormData): Promise<any> {
        return this.upload('space/attachment', form)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-user-list/
     */
    async getUsers(): Promise<any> {
        return this.get('users')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-user/
     */
    async getUser(userId: number): Promise<any> {
        return this.get(`users/${userId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-user/
     */
    async postUser(params: Option.User.PostUserParams): Promise<any> {
        return this.post('users', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-user/
     */
    async patchUser(userId: number, params: Option.User.PatchUserParams): Promise<any> {
        return this.patch(`users/${userId}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-user/
     */
    async deleteUser(userId: number): Promise<any> {
        return this.delete(`users/${userId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-own-user/
     */
    async getMyself(): Promise<any> {
        return this.get('users/myself')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-user-icon/
     */
    async getUserIcon(userId: number): Promise<Entity.File.FileData> {
        return this.download(`users/${userId}/icon`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-user-recent-updates/
     */
    async getUserActivities(userId: number, params: Option.User.GetUserActivitiesParams): Promise<any> {
        return this.get(`users/${userId}/activities`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-received-star-list/
     */
    async getUserStars(userId: number, params: Option.User.GetUserStarsParams): Promise<any> {
        return this.get(`users/${userId}/stars`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/count-user-received-stars/
     */
    async getUserStarsCount(userId: number, params: Option.User.GetUserStarsCountParams): Promise<any> {
        return this.get(`users/${userId}/stars/count`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-recently-viewed-issues/
     */
    async getRecentlyViewedIssues(params: Option.User.GetRecentlyViewedParams): Promise<any> {
        return this.get('users/myself/recentlyViewedIssues', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-recently-viewed-projects/
     */
    async getRecentlyViewedProjects(params: Option.User.GetRecentlyViewedParams): Promise<any> {
        return this.get('users/myself/recentlyViewedProjects', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-recently-viewed-wikis/
     */
    async getRecentlyViewedWikis(params: Option.User.GetRecentlyViewedParams): Promise<any> {
        return this.get('users/myself/recentlyViewedWikis', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-groups/
     * @deprecated
     */
    async getGroups(params: Option.Group.GetGroupsParams): Promise<any> {
        console.warn('Deprecated: Use getTeams instead.')
        return this.get('groups', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-group/
     * @deprecated
     */
    async postGroups(params: Option.Group.PostGroupsParams): Promise<any> {
        console.warn('Deprecated: Use postTeam instead.')
        return this.post('groups', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-group/
     * @deprecated
     */
    async getGroup(groupId: number): Promise<any> {
        console.warn('Deprecated: Use getTeam instead.')
        return this.get(`groups/${groupId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-group/
     * @deprecated
     */
    async patchGroup(groupId: number, params: Option.Group.PatchGroupParams): Promise<any> {
        console.warn('Deprecated: Use patchTeam instead.')
        return this.patch(`groups/${groupId}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-group/
     * @deprecated
     */
    async deleteGroup(groupId: number): Promise<any> {
        console.warn('Deprecated: Use deleteTeam instead.')
        return this.delete(`groups/${groupId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-status-list/
     * @deprecated
     */
    async getStatuses(): Promise<any> {
        console.warn('Deprecated: Use getProjectStatuses instead.')
        return this.get('statuses')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-status-list-of-project/
     */
    async getProjectStatuses(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/statuses`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-resolution-list/
     */
    async getResolutions(): Promise<any> {
        return this.get('resolutions')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-priority-list/
     */
    async getPriorities(): Promise<any> {
        return this.get('priorities')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-project-list/
     */
    async getProjects(params?: Option.Project.GetProjectsParams): Promise<any> {
        return this.get('projects', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-project/
     */
    async postProject(params: Option.Project.PostProjectParams): Promise<any> {
        return this.post('projects', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-project/
     */
    async getProject(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-project/
     */
    async patchProject(
        projectIdOrKey: string | number,
        params: Option.Project.PatchProjectParams,
    ): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-project/
     */
    async deleteProject(projectIdOrKey: string | number): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-project-icon/
     */
    async getProjectIcon(projectIdOrKey: string | number): Promise<Entity.File.FileData> {
        return this.download(`projects/${projectIdOrKey}/image`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-project-recent-updates/
     */
    async getProjectActivities(
        projectIdOrKey: string | number,
        params: Option.Space.GetActivitiesParams,
    ): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/activities`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-project-user/
     */
    async postProjectUser(projectIdOrKey: string | number, userId: string): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/users`, { userId })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-project-user-list/
     */
    async getProjectUsers(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/users`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-project-user/
     */
    async deleteProjectUsers(
        projectIdOrKey: string | number,
        params: Option.Project.DeleteProjectUsersParams,
    ): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/users`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-project-administrator/
     */
    async postProjectAdministrators(
        projectIdOrKey: string | number,
        params: Option.Project.PostProjectAdministrators,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/administrators`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-project-administrators/
     */
    async getProjectAdministrators(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/administrators`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-project-administrator/
     */
    async deleteProjectAdministrators(
        projectIdOrKey: string | number,
        params: Option.Project.DeleteProjectAdministrators,
    ): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/administrators`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-status/
     */
    async postProjectStatus(
        projectIdOrKey: string | number,
        params: Option.Project.PostStatusParams,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/statuses`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-status/
     */
    async patchProjectStatus(
        projectIdOrKey: string | number,
        id: number,
        params: Option.Project.PatchStatusParams,
    ): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}/statuses/${id}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-status/
     */
    async deleteProjectStatus(
        projectIdOrKey: string | number,
        id: number,
        substituteStatusId: number,
    ): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/statuses/${id}`, { substituteStatusId })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-order-of-status/
     */
    async patchProjectStatusOrder(projectIdOrKey: string | number, statusId: number[]): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}/statuses/updateDisplayOrder`, { statusId })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-issue-type-list/
     */
    async getIssueTypes(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/issueTypes`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-issue-type/
     */
    async postIssueType(
        projectIdOrKey: string | number,
        params: Option.Project.PostIssueTypeParams,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/issueTypes`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-issue-type/
     */
    async patchIssueType(
        projectIdOrKey: string | number,
        id: number,
        params: Option.Project.PatchIssueTypeParams,
    ): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}/issueTypes/${id}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-issue-type/
     */
    async deleteIssueType(
        projectIdOrKey: string | number,
        id: number,
        params: Option.Project.DeleteIssueTypeParams,
    ): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/issueTypes/${id}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-category-list/
     */
    async getCategories(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/categories`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-category/
     */
    async postCategories(
        projectIdOrKey: string | number,
        params: Option.Project.PostCategoriesParams,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/categories`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-category/
     */
    async patchCategories(
        projectIdOrKey: string | number,
        id: number,
        params: Option.Project.PatchCategoriesParams,
    ): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}/categories/${id}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-category/
     */
    async deleteCategories(projectIdOrKey: string | number, id: number): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/categories/${id}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-version-milestone-list/
     */
    async getVersions(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/versions`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-version-milestone/
     */
    async postVersions(
        projectIdOrKey: string | number,
        params: Option.Project.PostVersionsParams,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/versions`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-version-milestone/
     */
    async patchVersions(
        projectIdOrKey: string | number,
        id: number,
        params: Option.Project.PatchVersionsParams,
    ): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}/versions/${id}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-version/
     */
    async deleteVersions(projectIdOrKey: string | number, id: number): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/versions/${id}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-custom-field-list/
     */
    async getCustomFields(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/customFields`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-custom-field/
     */
    async postCustomField(
        projectIdOrKey: string | number,
        params:
            | Option.Project.PostCustomFieldParams
            | Option.Project.PostCustomFieldWithNumericParams
            | Option.Project.PostCustomFieldWithDateParams
            | Option.Project.PostCustomFieldWithListParams,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/customFields`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-custom-field/
     */
    async patchCustomField(
        projectIdOrKey: string | number,
        id: number,
        params:
            | Option.Project.PatchCustomFieldParams
            | Option.Project.PatchCustomFieldWithNumericParams
            | Option.Project.PatchCustomFieldWithDateParams
            | Option.Project.PatchCustomFieldWithListParams,
    ): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}/customFields/${id}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-custom-field/
     */
    async deleteCustomField(projectIdOrKey: string | number, id: number): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/customFields/${id}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-list-item-for-list-type-custom-field/
     */
    async postCustomFieldItem(
        projectIdOrKey: string | number,
        id: number,
        params: Option.Project.PostCustomFieldItemParams,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/customFields/${id}/items`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-list-item-for-list-type-custom-field/
     */
    async patchCustomFieldItem(
        projectIdOrKey: string | number,
        id: number,
        itemId: number,
        params: Option.Project.PatchCustomFieldItemParams,
    ): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}/customFields/${id}/items/${itemId}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-list-item-for-list-type-custom-field/
     */
    async deleteCustomFieldItem(projectIdOrKey: string | number, id: number, itemId: number): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/customFields/${id}/items/${itemId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-shared-files/
     */
    async getSharedFiles(
        projectIdOrKey: string | number,
        path: string,
        params: Option.Project.GetSharedFilesParams,
    ): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/files/metadata/${path}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-file/
     */
    async getSharedFile(
        projectIdOrKey: string | number,
        sharedFileId: number,
    ): Promise<Entity.File.FileData> {
        return this.download(`projects/${projectIdOrKey}/files/${sharedFileId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-project-disk-usage/
     */
    async getProjectsDiskUsage(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/diskUsage`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-webhooks/
     */
    async getWebhooks(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/webhooks`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-webhook/
     */
    async postWebhook(
        projectIdOrKey: string | number,
        params: Option.Project.PostWebhookParams,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/webhooks`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-webhook/
     */
    async getWebhook(projectIdOrKey: string | number, webhookId: string): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/webhooks/${webhookId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-webhook/
     */
    async patchWebhook(
        projectIdOrKey: string | number,
        webhookId: string,
        params: Option.Project.PatchWebhookParams,
    ): Promise<any> {
        return this.patch(`projects/${projectIdOrKey}/webhooks/${webhookId}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-webhook/
     */
    async deleteWebhook(projectIdOrKey: string | number, webhookId: string): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/webhooks/${webhookId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-issue-list/
     */
    async getIssues(params?: Option.Issue.GetIssuesParams): Promise<any> {
        return this.get('issues', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/count-issue/
     */
    async getIssuesCount(params?: Option.Issue.GetIssuesParams): Promise<any> {
        return this.get('issues/count', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-issue/
     */
    async postIssue(params: Option.Issue.PostIssueParams): Promise<any> {
        return this.post('issues', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-issue/
     */
    async patchIssue(issueIdOrKey: string | number, params: Option.Issue.PatchIssueParams): Promise<any> {
        return this.patch(`issues/${issueIdOrKey}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-issue/
     */
    async getIssue(issueIdOrKey: string | number): Promise<any> {
        return this.get(`issues/${issueIdOrKey}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-issue/
     */
    async deleteIssuesCount(issueIdOrKey: string | number): Promise<any> {
        return this.delete(`issues/${issueIdOrKey}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-comment-list/
     */
    async getIssueComments(
        issueIdOrKey: string | number,
        params: Option.Issue.GetIssueCommentsParams,
    ): Promise<any> {
        return this.get(`issues/${issueIdOrKey}/comments`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-comment/
     */
    async postIssueComments(
        issueIdOrKey: string | number,
        params: Option.Issue.PostIssueCommentsParams,
    ): Promise<any> {
        return this.post(`issues/${issueIdOrKey}/comments`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/count-comment/
     */
    async getIssueCommentsCount(issueIdOrKey: string | number): Promise<any> {
        return this.get(`issues/${issueIdOrKey}/comments/count`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-comment/
     */
    async getIssueComment(issueIdOrKey: string | number, commentId: number): Promise<any> {
        return this.get(`issues/${issueIdOrKey}/comments/${commentId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-comment/
     */
    async deleteIssueComment(issueIdOrKey: string | number, commentId: number): Promise<any> {
        return this.delete(`issues/${issueIdOrKey}/comments/${commentId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-comment/
     */
    async patchIssueComment(
        issueIdOrKey: string | number,
        commentId: number,
        params: Option.Issue.PatchIssueCommentParams,
    ): Promise<any> {
        return this.patch(`issues/${issueIdOrKey}/comments/${commentId}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-comment-notifications/
     */
    async getIssueCommentNotifications(issueIdOrKey: string | number, commentId: number): Promise<any> {
        return this.get(`issues/${issueIdOrKey}/comments/${commentId}/notifications`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-comment-notification/
     */
    async postIssueCommentNotifications(
        issueIdOrKey: string | number,
        commentId: number,
        prams: Option.Issue.IssueCommentNotifications,
    ): Promise<any> {
        return this.post(`issues/${issueIdOrKey}/comments/${commentId}/notifications`, prams)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-issue-attachments/
     */
    async getIssueAttachments(issueIdOrKey: string | number): Promise<any> {
        return this.get(`issues/${issueIdOrKey}/attachments`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-issue-attachment/
     */
    async getIssueAttachment(
        issueIdOrKey: string | number,
        attachmentId: number,
    ): Promise<Entity.File.FileData> {
        return this.download(`issues/${issueIdOrKey}/attachments/${attachmentId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-issue-attachment/
     */
    async deleteIssueAttachment(issueIdOrKey: string | number, attachmentId: string): Promise<any> {
        return this.delete(`issues/${issueIdOrKey}/attachments/${attachmentId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-issue-participant-list/
     */
    async getIssueParticipants(issueIdOrKey: string | number): Promise<any> {
        return this.get(`issues/${issueIdOrKey}/participants`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-linked-shared-files/
     */
    async getIssueSharedFiles(issueIdOrKey: string | number): Promise<any> {
        return this.get(`issues/${issueIdOrKey}/sharedFiles`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/link-shared-files-to-issue/
     */
    async linkIssueSharedFiles(
        issueIdOrKey: string | number,
        params: Option.Issue.LinkIssueSharedFilesParams,
    ): Promise<any> {
        return this.post(`issues/${issueIdOrKey}/sharedFiles`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/remove-link-to-shared-file-from-issue/
     */
    async unlinkIssueSharedFile(issueIdOrKey: string | number, id: number): Promise<any> {
        return this.delete(`issues/${issueIdOrKey}/sharedFiles/${id}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-list/
     */
    async getWikis(params: Option.Wiki.GetWikiParams): Promise<any> {
        return this.get('wikis', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/count-wiki-page/
     */
    async getWikisCount(projectIdOrKey: string | number): Promise<any> {
        return this.get('wikis/count', { projectIdOrKey })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-tag-list/
     */
    async getWikisTags(projectIdOrKey: string | number): Promise<any> {
        return this.get('wikis/tags', { projectIdOrKey })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-wiki-page/
     */
    async postWiki(params: Option.Wiki.PostWikiParams): Promise<any> {
        return this.post('wikis', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page/
     */
    async getWiki(wikiId: number): Promise<any> {
        return this.get(`wikis/${wikiId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-wiki-page/
     */
    async patchWiki(wikiId: number, params: Option.Wiki.PatchWikiParams): Promise<any> {
        return this.patch(`wikis/${wikiId}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-wiki-page/
     */
    async deleteWiki(wikiId: number, mailNotify: boolean): Promise<any> {
        return this.delete(`wikis/${wikiId}`, { mailNotify })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-wiki-attachments/
     */
    async getWikisAttachments(wikiId: number): Promise<any> {
        return this.get(`wikis/${wikiId}/attachments`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/attach-file-to-wiki/
     */
    async postWikisAttachments(wikiId: number, attachmentId: number[]): Promise<any> {
        return this.post(`wikis/${wikiId}/attachments`, { attachmentId })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-attachment/
     */
    async getWikiAttachment(wikiId: number, attachmentId: number): Promise<Entity.File.FileData> {
        return this.download(`wikis/${wikiId}/attachments/${attachmentId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/remove-wiki-attachment/
     */
    async deleteWikisAttachments(wikiId: number, attachmentId: number): Promise<any> {
        return this.delete(`wikis/${wikiId}/attachments/${attachmentId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-shared-files-on-wiki/
     */
    async getWikisSharedFiles(wikiId: number): Promise<any> {
        return this.get(`wikis/${wikiId}/sharedFiles`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/link-shared-files-to-wiki/
     */
    async linkWikisSharedFiles(wikiId: number, fileId: number[]): Promise<any> {
        return this.post(`wikis/${wikiId}/sharedFiles`, { fileId })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/remove-link-to-shared-file-from-wiki/
     */
    async unlinkWikisSharedFiles(wikiId: number, id: number): Promise<any> {
        return this.delete(`wikis/${wikiId}/sharedFiles/${id}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-history/
     */
    async getWikisHistory(wikiId: number, params: Option.Wiki.GetWikisHistoryParams): Promise<any> {
        return this.get(`wikis/${wikiId}/history`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-wiki-page-star/
     */
    async getWikisStars(wikiId: number): Promise<any> {
        return this.get(`wikis/${wikiId}/stars`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-star/
     */
    async postStar(params: Option.Project.PostStarParams): Promise<any> {
        return this.post('stars', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-notification/
     */
    async getNotifications(params: Option.Notification.GetNotificationsParams): Promise<any> {
        return this.get('notifications', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/count-notification/
     */
    async getNotificationsCount(params: Option.Notification.GetNotificationsCountParams): Promise<any> {
        return this.get('notifications/count', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/reset-unread-notification-count/
     */
    async resetNotificationsMarkAsRead(): Promise<any> {
        return this.post('notifications/markAsRead')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/read-notification/
     */
    async markAsReadNotification(id: number): Promise<any> {
        return this.post(`notifications/${id}/markAsRead`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-git-repositories/
     */
    async getGitRepositories(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/git/repositories`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-git-repository/
     */
    async getGitRepository(projectIdOrKey: string | number, repoIdOrName: string): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-pull-request-list/
     */
    async getPullRequests(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        params: Option.PullRequest.GetPullRequestsParams,
    ): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-number-of-pull-requests/
     */
    async getPullRequestsCount(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        params: Option.PullRequest.GetPullRequestsParams,
    ): Promise<any> {
        return this.get(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/count`,
            params,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-pull-request/
     */
    async postPullRequest(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        params: Option.PullRequest.PostPullRequestParams,
    ): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-pull-request/
     */
    async getPullRequest(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
    ): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-pull-request/
     */
    async patchPullRequest(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
        params: Option.PullRequest.PatchPullRequestParams,
    ): Promise<any> {
        return this.patch(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}`,
            params,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-pull-request-comment/
     */
    async getPullRequestComments(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
        params: Option.PullRequest.GetPullRequestCommentsParams,
    ): Promise<any> {
        return this.get(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/comments`,
            params,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-pull-request-comment/
     */
    async postPullRequestComments(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
        params: Option.PullRequest.PostPullRequestCommentsParams,
    ): Promise<any> {
        return this.post(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/comments`,
            params,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-number-of-pull-request-comments/
     */
    async getPullRequestCommentsCount(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
    ): Promise<any> {
        return this.get(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/comments/count`,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-pull-request-comment-information/
     */
    async patchPullRequestComments(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
        commentId: number,
        params: Option.PullRequest.PatchPullRequestCommentsParams,
    ): Promise<any> {
        return this.patch(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/comments/${commentId}`,
            params,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-pull-request-attachment/
     */
    async getPullRequestAttachments(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
    ): Promise<any> {
        return this.get(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/attachments`,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/download-pull-request-attachment/
     */
    async getPullRequestAttachment(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
        attachmentId: number,
    ): Promise<Entity.File.FileData> {
        return this.download(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/attachments/${attachmentId}`,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-pull-request-attachments/
     */
    async deletePullRequestAttachment(
        projectIdOrKey: string | number,
        repoIdOrName: string,
        number: number,
        attachmentId: number,
    ): Promise<any> {
        return this.get(
            `projects/${projectIdOrKey}/git/repositories/${repoIdOrName}/pullRequests/${number}/attachments/${attachmentId}`,
        )
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-watching-list
     */
    async getWatchingListItems(userId: number): Promise<any> {
        return this.get(`users/${userId}/watchings`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/count-watching
     */
    async getWatchingListCount(userId: number): Promise<any> {
        return this.get(`users/${userId}/watchings/count`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-watching
     */
    async getWatchingListItem(watchId: number): Promise<any> {
        return this.get(`watchings/${watchId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-watching
     */
    async postWatchingListItem(params: any): Promise<any> {
        return this.post('watchings', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-watching
     */
    async patchWatchingListItem(watchId: number, note: string): Promise<any> {
        return this.patch(`watchings/${watchId}`, { note })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-watching
     */
    async deletehWatchingListItem(watchId: number): Promise<any> {
        return this.delete(`watchings/${watchId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/mark-watching-as-read
     */
    async resetWatchingListItemAsRead(watchId: number): Promise<undefined> {
        return this.post(`watchings/${watchId}/markAsRead`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-project-group-list
     * @deprecated
     */
    async getProjectGroupList(projectIdOrKey: string | number): Promise<any> {
        console.warn('Deprecated: Use getProjectTeams instead.')
        return this.get(`projects/${projectIdOrKey}/groups`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-project-group
     * @deprecated
     */
    async postProjectGroup(projectIdOrKey: string | number, params: any): Promise<any> {
        console.warn('Deprecated: Use postProjectTeam instead.')
        return this.post(`projects/${projectIdOrKey}/groups`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-project-group
     * @deprecated
     */
    async deleteProjectGroup(projectIdOrKey: string | number): Promise<any> {
        console.warn('Deprecated: Use deleteProjectTeam instead.')
        return this.delete(`projects/${projectIdOrKey}/groups`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-group-icon
     * @deprecated
     */
    async getGroupIcon(groupId: string): Promise<any> {
        console.warn('Deprecated: Use getTeamIcon instead.')
        return this.download(`groups/${groupId}/icon`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-licence
     */
    async getLicence(): Promise<any> {
        return this.get('space/licence')
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-list-of-teams/
     */
    async getTeams(params?: Option.Team.GetTeamsParams): Promise<any> {
        return this.get('teams', params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-team/
     */
    async postTeam(members: number[]): Promise<any> {
        return this.post('teams', { members })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-team/
     */
    async getTeam(teamId: number): Promise<any> {
        return this.get(`teams/${teamId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/update-team/
     */
    async patchTeam(teamId: number, params: Option.Team.PatchTeamParams): Promise<any> {
        return this.patch(`teams/${teamId}`, params)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-team/
     */
    async deleteTeam(teamId: number): Promise<any> {
        return this.delete(`teams/${teamId}`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-team-icon/
     */
    async getTeamIcon(teamId: number): Promise<Entity.File.FileData> {
        return this.download(`teams/${teamId}/icon`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-project-team-list/
     */
    async getProjectTeams(projectIdOrKey: string | number): Promise<any> {
        return this.get(`projects/${projectIdOrKey}/teams`)
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/add-project-team/
     */
    async postProjectTeam(projectIdOrKey: string | number, teamId: number): Promise<any> {
        return this.post(`projects/${projectIdOrKey}/teams`, { teamId })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/delete-project-team/
     */
    async deleteProjectTeam(projectIdOrKey: string | number, teamId: number): Promise<any> {
        return this.delete(`projects/${projectIdOrKey}/teams`, { teamId })
    }

    /**
     * https://developer.nulab.com/docs/backlog/api/2/get-rate-limit/
     */
    async getRateLimit(): Promise<any> {
        return this.get('rateLimit')
    }

    private async download(path: string): Promise<Entity.File.FileData> {
        // eslint-disable-next-line github/no-then
        return this.request({ method: 'GET', path }).then(this.parseFileData)
    }

    private async upload(path: string, params: FormData): Promise<any> {
        // eslint-disable-next-line github/no-then
        return this.request({ method: 'POST', path, params }).then(this.parseJSON)
    }

    private async parseFileData(response: Response): Promise<Entity.File.FileData> {
        return new Promise((resolve, _) => {
            if (typeof window !== 'undefined') {
                resolve({
                    body: (response as any).body,
                    url: response.url,
                    blob: async () => response.blob(),
                })
            } else {
                const disposition = response.headers.get('Content-Disposition')
                const filename = disposition ? disposition.substring(disposition.indexOf("''") + 2) : ''
                resolve({
                    body: (response as any).body,
                    url: response.url,
                    filename,
                })
            }
        })
    }
}
