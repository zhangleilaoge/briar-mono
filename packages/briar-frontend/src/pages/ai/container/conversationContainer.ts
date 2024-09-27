import { createContainer } from '@/hooks/useContainer';

import useConversationList from '../hooks/useConversationList';

export const conversationContainer = createContainer(useConversationList);
