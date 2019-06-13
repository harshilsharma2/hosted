import { Activity, BotAdapter, ConversationReference, TurnContext, ResourceResponse } from 'botbuilder';
export declare class MattermostAdapter extends BotAdapter {
    /**
     * Botkit plugin name
     */
    name: string;
    constructor();
    /**
     * Botkit-only: Initialization function called automatically when used with Botkit.
     * @param botkit
     */
    init(botkit: any): void;
    continueConversation(reference: Partial<ConversationReference>, logic: (context: TurnContext) => Promise<void>): Promise<void>;
    deleteActivity(context: TurnContext, reference: Partial<ConversationReference>): Promise<void>;
    updateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void>;
    sendActivities(context: TurnContext, activities: Partial<Activity>[]): Promise<ResourceResponse[]>;
    processActivity(req: any, res: any, logic: (context: TurnContext) => Promise<void>): Promise<void>;
}
