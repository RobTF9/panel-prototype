<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'reka-ui'
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPortal,
  TooltipArrow,
} from 'reka-ui'
import { Table, Globe, Plus, Search, X } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'

interface DataTable {
  id: string
  name: string
  type: 'local' | 'global'
  schema?: any
  data?: any[]
}

const selectedTableId = ref<string>('')
const showColumn2 = ref(false)
const selectedDataTab = ref('data')
const searchQuery = ref('')

// Column sizes for collapsible behavior
const column1Size = ref(30)
const column2Size = ref(70)
const isColumn1Collapsed = computed(() => column1Size.value <= 5)

// Generate dummy table data
function generateTableData(): DataTable[] {
  return [
    {
      id: 'table-1',
      name: 'Memory',
      type: 'local',
      schema: {
        columns: [
          { name: 'id', type: 'string', primary: true },
          { name: 'content', type: 'text' },
          { name: 'timestamp', type: 'datetime' },
          { name: 'user_id', type: 'string' },
          { name: 'session_id', type: 'string' },
          { name: 'importance', type: 'number' },
          { name: 'category', type: 'string' },
          { name: 'sentiment', type: 'string' },
          { name: 'keywords', type: 'array' },
          { name: 'response_time', type: 'number' },
          { name: 'context_length', type: 'number' },
          { name: 'follow_up_needed', type: 'boolean' },
          { name: 'language', type: 'string' },
          { name: 'device_type', type: 'string' },
          { name: 'location', type: 'string' },
        ],
      },
      data: [
        {
          id: 'mem_001',
          content: 'User asked about weather forecast for next week',
          timestamp: '2024-01-15T10:30:00Z',
          user_id: 'user123',
          session_id: 'sess_001',
          importance: 3,
          category: 'question',
          sentiment: 'neutral',
          keywords: ['weather', 'forecast'],
          response_time: 1.2,
          context_length: 45,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_002',
          content: 'Discussed project timeline and delivery milestones',
          timestamp: '2024-01-15T11:45:00Z',
          user_id: 'user456',
          session_id: 'sess_002',
          importance: 8,
          category: 'planning',
          sentiment: 'positive',
          keywords: ['project', 'timeline', 'milestones'],
          response_time: 2.1,
          context_length: 124,
          follow_up_needed: true,
          language: 'en',
          device_type: 'mobile',
          location: 'San Francisco',
        },
        {
          id: 'mem_003',
          content: 'User mentioned preference for dark mode UI',
          timestamp: '2024-01-15T12:15:00Z',
          user_id: 'user123',
          session_id: 'sess_001',
          importance: 5,
          category: 'preference',
          sentiment: 'neutral',
          keywords: ['dark mode', 'UI'],
          response_time: 0.8,
          context_length: 67,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_004',
          content: 'Troubleshooting database connection issues',
          timestamp: '2024-01-15T13:20:00Z',
          user_id: 'user789',
          session_id: 'sess_003',
          importance: 9,
          category: 'technical',
          sentiment: 'negative',
          keywords: ['database', 'connection', 'troubleshooting'],
          response_time: 3.5,
          context_length: 89,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_005',
          content: 'User asked for explanation of machine learning concepts',
          timestamp: '2024-01-15T14:30:00Z',
          user_id: 'user456',
          session_id: 'sess_002',
          importance: 6,
          category: 'education',
          sentiment: 'curious',
          keywords: ['machine learning', 'concepts'],
          response_time: 4.2,
          context_length: 156,
          follow_up_needed: false,
          language: 'en',
          device_type: 'tablet',
          location: 'San Francisco',
        },
        {
          id: 'mem_006',
          content: 'Discussion about API authentication methods',
          timestamp: '2024-01-15T15:45:00Z',
          user_id: 'user123',
          session_id: 'sess_004',
          importance: 7,
          category: 'technical',
          sentiment: 'neutral',
          keywords: ['API', 'authentication'],
          response_time: 2.8,
          context_length: 98,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_007',
          content: 'User reported bug in payment processing module',
          timestamp: '2024-01-15T16:10:00Z',
          user_id: 'user789',
          session_id: 'sess_003',
          importance: 10,
          category: 'bug_report',
          sentiment: 'frustrated',
          keywords: ['bug', 'payment', 'processing'],
          response_time: 1.9,
          context_length: 76,
          follow_up_needed: true,
          language: 'en',
          device_type: 'mobile',
          location: 'London',
        },
        {
          id: 'mem_008',
          content: 'Casual conversation about weekend plans',
          timestamp: '2024-01-15T17:25:00Z',
          user_id: 'user456',
          session_id: 'sess_005',
          importance: 1,
          category: 'social',
          sentiment: 'positive',
          keywords: ['weekend', 'plans'],
          response_time: 0.5,
          context_length: 34,
          follow_up_needed: false,
          language: 'en',
          device_type: 'mobile',
          location: 'San Francisco',
        },
        {
          id: 'mem_009',
          content: 'User requested feature enhancement for dashboard',
          timestamp: '2024-01-15T18:40:00Z',
          user_id: 'user123',
          session_id: 'sess_004',
          importance: 8,
          category: 'feature_request',
          sentiment: 'hopeful',
          keywords: ['feature', 'enhancement', 'dashboard'],
          response_time: 2.3,
          context_length: 112,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_010',
          content: 'Help with SQL query optimization',
          timestamp: '2024-01-15T19:15:00Z',
          user_id: 'user789',
          session_id: 'sess_006',
          importance: 7,
          category: 'technical',
          sentiment: 'neutral',
          keywords: ['SQL', 'optimization'],
          response_time: 3.1,
          context_length: 87,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_011',
          content: 'User shared feedback about new interface design',
          timestamp: '2024-01-16T09:30:00Z',
          user_id: 'user456',
          session_id: 'sess_007',
          importance: 6,
          category: 'feedback',
          sentiment: 'mixed',
          keywords: ['feedback', 'interface', 'design'],
          response_time: 1.7,
          context_length: 95,
          follow_up_needed: false,
          language: 'en',
          device_type: 'tablet',
          location: 'San Francisco',
        },
        {
          id: 'mem_012',
          content: 'Discussion about cloud migration strategy',
          timestamp: '2024-01-16T10:45:00Z',
          user_id: 'user123',
          session_id: 'sess_008',
          importance: 9,
          category: 'planning',
          sentiment: 'serious',
          keywords: ['cloud', 'migration', 'strategy'],
          response_time: 4.8,
          context_length: 167,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_013',
          content: 'User asked about data backup procedures',
          timestamp: '2024-01-16T11:20:00Z',
          user_id: 'user789',
          session_id: 'sess_009',
          importance: 8,
          category: 'question',
          sentiment: 'concerned',
          keywords: ['data', 'backup', 'procedures'],
          response_time: 2.6,
          context_length: 78,
          follow_up_needed: false,
          language: 'en',
          device_type: 'mobile',
          location: 'London',
        },
        {
          id: 'mem_014',
          content: 'Brainstorming session for new product features',
          timestamp: '2024-01-16T14:15:00Z',
          user_id: 'user456',
          session_id: 'sess_010',
          importance: 7,
          category: 'planning',
          sentiment: 'excited',
          keywords: ['brainstorming', 'product', 'features'],
          response_time: 3.9,
          context_length: 134,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_015',
          content: 'User mentioned working remotely from London',
          timestamp: '2024-01-16T15:30:00Z',
          user_id: 'user123',
          session_id: 'sess_011',
          importance: 4,
          category: 'personal',
          sentiment: 'neutral',
          keywords: ['remote work', 'London'],
          response_time: 0.9,
          context_length: 42,
          follow_up_needed: false,
          language: 'en',
          device_type: 'mobile',
          location: 'London',
        },
        {
          id: 'mem_016',
          content: 'Complex debugging session for memory leaks in production',
          timestamp: '2024-01-16T16:45:00Z',
          user_id: 'user789',
          session_id: 'sess_012',
          importance: 10,
          category: 'technical',
          sentiment: 'stressed',
          keywords: ['debugging', 'memory leaks', 'production'],
          response_time: 5.2,
          context_length: 189,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_017',
          content: 'User wants to integrate third-party analytics service',
          timestamp: '2024-01-16T17:30:00Z',
          user_id: 'user456',
          session_id: 'sess_013',
          importance: 7,
          category: 'integration',
          sentiment: 'determined',
          keywords: ['analytics', 'third-party', 'integration'],
          response_time: 3.4,
          context_length: 145,
          follow_up_needed: true,
          language: 'en',
          device_type: 'tablet',
          location: 'San Francisco',
        },
        {
          id: 'mem_018',
          content: 'Performance optimization discussion for mobile app',
          timestamp: '2024-01-17T09:15:00Z',
          user_id: 'user123',
          session_id: 'sess_014',
          importance: 9,
          category: 'performance',
          sentiment: 'focused',
          keywords: ['performance', 'optimization', 'mobile'],
          response_time: 4.1,
          context_length: 178,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_019',
          content: 'User complained about slow loading times on dashboard',
          timestamp: '2024-01-17T11:22:00Z',
          user_id: 'user789',
          session_id: 'sess_015',
          importance: 8,
          category: 'performance',
          sentiment: 'frustrated',
          keywords: ['slow', 'loading', 'dashboard'],
          response_time: 2.1,
          context_length: 92,
          follow_up_needed: true,
          language: 'en',
          device_type: 'mobile',
          location: 'London',
        },
        {
          id: 'mem_020',
          content: 'Security audit recommendations and implementation planning',
          timestamp: '2024-01-17T14:30:00Z',
          user_id: 'user456',
          session_id: 'sess_016',
          importance: 10,
          category: 'security',
          sentiment: 'serious',
          keywords: ['security', 'audit', 'recommendations'],
          response_time: 6.8,
          context_length: 234,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_021',
          content: 'Database schema migration discussion for new features',
          timestamp: '2024-01-17T16:15:00Z',
          user_id: 'user789',
          session_id: 'sess_017',
          importance: 8,
          category: 'technical',
          sentiment: 'focused',
          keywords: ['database', 'schema', 'migration'],
          response_time: 4.3,
          context_length: 167,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_022',
          content: 'User interface redesign feedback and suggestions',
          timestamp: '2024-01-17T18:45:00Z',
          user_id: 'user123',
          session_id: 'sess_018',
          importance: 6,
          category: 'feedback',
          sentiment: 'constructive',
          keywords: ['UI', 'redesign', 'feedback'],
          response_time: 3.1,
          context_length: 142,
          follow_up_needed: false,
          language: 'en',
          device_type: 'tablet',
          location: 'New York',
        },
        {
          id: 'mem_023',
          content: 'API rate limiting implementation and testing strategies',
          timestamp: '2024-01-18T09:30:00Z',
          user_id: 'user456',
          session_id: 'sess_019',
          importance: 7,
          category: 'technical',
          sentiment: 'analytical',
          keywords: ['API', 'rate limiting', 'testing'],
          response_time: 5.2,
          context_length: 198,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_024',
          content: 'Customer onboarding process improvement brainstorming',
          timestamp: '2024-01-18T11:20:00Z',
          user_id: 'user789',
          session_id: 'sess_020',
          importance: 8,
          category: 'planning',
          sentiment: 'enthusiastic',
          keywords: ['onboarding', 'improvement', 'brainstorming'],
          response_time: 3.8,
          context_length: 156,
          follow_up_needed: true,
          language: 'en',
          device_type: 'mobile',
          location: 'London',
        },
        {
          id: 'mem_025',
          content: 'Code review guidelines and best practices documentation',
          timestamp: '2024-01-18T14:10:00Z',
          user_id: 'user123',
          session_id: 'sess_021',
          importance: 7,
          category: 'documentation',
          sentiment: 'methodical',
          keywords: ['code review', 'guidelines', 'best practices'],
          response_time: 4.7,
          context_length: 189,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_026',
          content: 'Cross-platform compatibility testing results and issues',
          timestamp: '2024-01-18T16:25:00Z',
          user_id: 'user456',
          session_id: 'sess_022',
          importance: 9,
          category: 'testing',
          sentiment: 'concerned',
          keywords: ['cross-platform', 'compatibility', 'testing'],
          response_time: 3.9,
          context_length: 201,
          follow_up_needed: true,
          language: 'en',
          device_type: 'tablet',
          location: 'San Francisco',
        },
        {
          id: 'mem_027',
          content: 'Microservices architecture transition planning meeting',
          timestamp: '2024-01-19T10:15:00Z',
          user_id: 'user789',
          session_id: 'sess_023',
          importance: 10,
          category: 'architecture',
          sentiment: 'strategic',
          keywords: ['microservices', 'architecture', 'transition'],
          response_time: 6.1,
          context_length: 245,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_028',
          content: 'User authentication token expiry handling discussion',
          timestamp: '2024-01-19T13:40:00Z',
          user_id: 'user123',
          session_id: 'sess_024',
          importance: 8,
          category: 'security',
          sentiment: 'technical',
          keywords: ['authentication', 'token', 'expiry'],
          response_time: 2.9,
          context_length: 134,
          follow_up_needed: false,
          language: 'en',
          device_type: 'mobile',
          location: 'New York',
        },
        {
          id: 'mem_029',
          content: 'Performance monitoring dashboard configuration setup',
          timestamp: '2024-01-19T15:55:00Z',
          user_id: 'user456',
          session_id: 'sess_025',
          importance: 7,
          category: 'monitoring',
          sentiment: 'focused',
          keywords: ['performance', 'monitoring', 'dashboard'],
          response_time: 4.4,
          context_length: 178,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_030',
          content: 'Third-party library security vulnerability assessment',
          timestamp: '2024-01-19T17:30:00Z',
          user_id: 'user789',
          session_id: 'sess_026',
          importance: 9,
          category: 'security',
          sentiment: 'vigilant',
          keywords: ['third-party', 'security', 'vulnerability'],
          response_time: 5.8,
          context_length: 212,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_031',
          content: 'Automated deployment pipeline troubleshooting session',
          timestamp: '2024-01-20T09:45:00Z',
          user_id: 'user123',
          session_id: 'sess_027',
          importance: 8,
          category: 'devops',
          sentiment: 'determined',
          keywords: ['deployment', 'pipeline', 'troubleshooting'],
          response_time: 4.1,
          context_length: 167,
          follow_up_needed: true,
          language: 'en',
          device_type: 'tablet',
          location: 'New York',
        },
        {
          id: 'mem_032',
          content: 'Data warehouse ETL process optimization strategies',
          timestamp: '2024-01-20T12:20:00Z',
          user_id: 'user456',
          session_id: 'sess_028',
          importance: 8,
          category: 'data',
          sentiment: 'analytical',
          keywords: ['data warehouse', 'ETL', 'optimization'],
          response_time: 5.3,
          context_length: 189,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_033',
          content: 'Mobile app push notification implementation details',
          timestamp: '2024-01-20T14:35:00Z',
          user_id: 'user789',
          session_id: 'sess_029',
          importance: 6,
          category: 'mobile',
          sentiment: 'practical',
          keywords: ['mobile', 'push notification', 'implementation'],
          response_time: 3.2,
          context_length: 145,
          follow_up_needed: false,
          language: 'en',
          device_type: 'mobile',
          location: 'London',
        },
        {
          id: 'mem_034',
          content: 'Real-time chat feature architecture design discussion',
          timestamp: '2024-01-20T16:50:00Z',
          user_id: 'user123',
          session_id: 'sess_030',
          importance: 9,
          category: 'feature',
          sentiment: 'creative',
          keywords: ['real-time', 'chat', 'architecture'],
          response_time: 6.7,
          context_length: 223,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_035',
          content: 'Load balancer configuration for high traffic scenarios',
          timestamp: '2024-01-21T10:25:00Z',
          user_id: 'user456',
          session_id: 'sess_031',
          importance: 9,
          category: 'infrastructure',
          sentiment: 'technical',
          keywords: ['load balancer', 'high traffic', 'configuration'],
          response_time: 4.9,
          context_length: 198,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_036',
          content: 'Content delivery network implementation planning',
          timestamp: '2024-01-21T13:15:00Z',
          user_id: 'user789',
          session_id: 'sess_032',
          importance: 7,
          category: 'infrastructure',
          sentiment: 'strategic',
          keywords: ['CDN', 'implementation', 'planning'],
          response_time: 3.6,
          context_length: 156,
          follow_up_needed: false,
          language: 'en',
          device_type: 'tablet',
          location: 'London',
        },
        {
          id: 'mem_037',
          content: 'User feedback analysis and product roadmap updates',
          timestamp: '2024-01-21T15:40:00Z',
          user_id: 'user123',
          session_id: 'sess_033',
          importance: 8,
          category: 'product',
          sentiment: 'insightful',
          keywords: ['user feedback', 'analysis', 'roadmap'],
          response_time: 4.2,
          context_length: 178,
          follow_up_needed: true,
          language: 'en',
          device_type: 'mobile',
          location: 'New York',
        },
        {
          id: 'mem_038',
          content: 'Docker container optimization for memory efficiency',
          timestamp: '2024-01-21T17:55:00Z',
          user_id: 'user456',
          session_id: 'sess_034',
          importance: 7,
          category: 'devops',
          sentiment: 'technical',
          keywords: ['Docker', 'container', 'optimization'],
          response_time: 3.8,
          context_length: 167,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_039',
          content: 'Machine learning model deployment infrastructure setup',
          timestamp: '2024-01-22T09:30:00Z',
          user_id: 'user789',
          session_id: 'sess_035',
          importance: 9,
          category: 'ml',
          sentiment: 'excited',
          keywords: ['machine learning', 'deployment', 'infrastructure'],
          response_time: 5.7,
          context_length: 212,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_040',
          content: 'API documentation generation automation tooling',
          timestamp: '2024-01-22T11:45:00Z',
          user_id: 'user123',
          session_id: 'sess_036',
          importance: 6,
          category: 'documentation',
          sentiment: 'efficient',
          keywords: ['API', 'documentation', 'automation'],
          response_time: 2.8,
          context_length: 134,
          follow_up_needed: false,
          language: 'en',
          device_type: 'tablet',
          location: 'New York',
        },
        {
          id: 'mem_041',
          content: 'Payment gateway integration testing and validation',
          timestamp: '2024-01-22T14:20:00Z',
          user_id: 'user456',
          session_id: 'sess_037',
          importance: 10,
          category: 'payment',
          sentiment: 'meticulous',
          keywords: ['payment gateway', 'integration', 'testing'],
          response_time: 4.6,
          context_length: 189,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_042',
          content: 'Accessibility compliance audit findings and remediation',
          timestamp: '2024-01-22T16:35:00Z',
          user_id: 'user789',
          session_id: 'sess_038',
          importance: 8,
          category: 'accessibility',
          sentiment: 'responsible',
          keywords: ['accessibility', 'compliance', 'audit'],
          response_time: 3.9,
          context_length: 178,
          follow_up_needed: true,
          language: 'en',
          device_type: 'mobile',
          location: 'London',
        },
        {
          id: 'mem_043',
          content: 'GraphQL schema design and implementation strategy',
          timestamp: '2024-01-23T10:10:00Z',
          user_id: 'user123',
          session_id: 'sess_039',
          importance: 8,
          category: 'api',
          sentiment: 'innovative',
          keywords: ['GraphQL', 'schema', 'implementation'],
          response_time: 5.1,
          context_length: 201,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_044',
          content: 'Kubernetes cluster scaling and resource management',
          timestamp: '2024-01-23T12:25:00Z',
          user_id: 'user456',
          session_id: 'sess_040',
          importance: 9,
          category: 'devops',
          sentiment: 'technical',
          keywords: ['Kubernetes', 'scaling', 'resource management'],
          response_time: 4.8,
          context_length: 198,
          follow_up_needed: false,
          language: 'en',
          device_type: 'tablet',
          location: 'San Francisco',
        },
        {
          id: 'mem_045',
          content: 'Error logging and monitoring system enhancement',
          timestamp: '2024-01-23T14:40:00Z',
          user_id: 'user789',
          session_id: 'sess_041',
          importance: 7,
          category: 'monitoring',
          sentiment: 'systematic',
          keywords: ['error logging', 'monitoring', 'enhancement'],
          response_time: 3.7,
          context_length: 167,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_046',
          content: 'Progressive web app conversion planning and timeline',
          timestamp: '2024-01-23T16:55:00Z',
          user_id: 'user123',
          session_id: 'sess_042',
          importance: 8,
          category: 'web',
          sentiment: 'forward-thinking',
          keywords: ['PWA', 'conversion', 'planning'],
          response_time: 4.3,
          context_length: 189,
          follow_up_needed: true,
          language: 'en',
          device_type: 'mobile',
          location: 'New York',
        },
        {
          id: 'mem_047',
          content: 'Data privacy compliance review and implementation',
          timestamp: '2024-01-24T09:15:00Z',
          user_id: 'user456',
          session_id: 'sess_043',
          importance: 10,
          category: 'privacy',
          sentiment: 'serious',
          keywords: ['data privacy', 'compliance', 'review'],
          response_time: 6.2,
          context_length: 234,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_048',
          content: 'Multi-tenant architecture design considerations',
          timestamp: '2024-01-24T11:30:00Z',
          user_id: 'user789',
          session_id: 'sess_044',
          importance: 9,
          category: 'architecture',
          sentiment: 'complex',
          keywords: ['multi-tenant', 'architecture', 'design'],
          response_time: 5.9,
          context_length: 212,
          follow_up_needed: true,
          language: 'en',
          device_type: 'tablet',
          location: 'London',
        },
        {
          id: 'mem_049',
          content: 'Continuous integration pipeline optimization workshop',
          timestamp: '2024-01-24T13:45:00Z',
          user_id: 'user123',
          session_id: 'sess_045',
          importance: 7,
          category: 'ci_cd',
          sentiment: 'collaborative',
          keywords: ['CI', 'pipeline', 'optimization'],
          response_time: 4.1,
          context_length: 178,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_050',
          content: 'Blockchain integration feasibility study and analysis',
          timestamp: '2024-01-24T15:20:00Z',
          user_id: 'user456',
          session_id: 'sess_046',
          importance: 6,
          category: 'research',
          sentiment: 'curious',
          keywords: ['blockchain', 'integration', 'feasibility'],
          response_time: 5.4,
          context_length: 201,
          follow_up_needed: false,
          language: 'en',
          device_type: 'mobile',
          location: 'San Francisco',
        },
        {
          id: 'mem_051',
          content: 'Voice user interface development exploration session',
          timestamp: '2024-01-24T17:35:00Z',
          user_id: 'user789',
          session_id: 'sess_047',
          importance: 5,
          category: 'ui',
          sentiment: 'experimental',
          keywords: ['voice UI', 'development', 'exploration'],
          response_time: 3.3,
          context_length: 156,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_052',
          content: 'Serverless function architecture migration planning',
          timestamp: '2024-01-25T10:50:00Z',
          user_id: 'user123',
          session_id: 'sess_048',
          importance: 8,
          category: 'serverless',
          sentiment: 'strategic',
          keywords: ['serverless', 'function', 'migration'],
          response_time: 4.7,
          context_length: 189,
          follow_up_needed: true,
          language: 'en',
          device_type: 'tablet',
          location: 'New York',
        },
        {
          id: 'mem_053',
          content: 'Real-time analytics dashboard performance tuning',
          timestamp: '2024-01-25T13:05:00Z',
          user_id: 'user456',
          session_id: 'sess_049',
          importance: 8,
          category: 'analytics',
          sentiment: 'performance-focused',
          keywords: ['real-time', 'analytics', 'performance'],
          response_time: 4.2,
          context_length: 178,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_054',
          content: 'Cross-browser testing automation framework setup',
          timestamp: '2024-01-25T15:20:00Z',
          user_id: 'user789',
          session_id: 'sess_050',
          importance: 7,
          category: 'testing',
          sentiment: 'methodical',
          keywords: ['cross-browser', 'testing', 'automation'],
          response_time: 3.8,
          context_length: 167,
          follow_up_needed: false,
          language: 'en',
          device_type: 'mobile',
          location: 'London',
        },
        {
          id: 'mem_055',
          content: 'Content management system integration requirements',
          timestamp: '2024-01-25T17:45:00Z',
          user_id: 'user123',
          session_id: 'sess_051',
          importance: 6,
          category: 'cms',
          sentiment: 'practical',
          keywords: ['CMS', 'integration', 'requirements'],
          response_time: 3.1,
          context_length: 145,
          follow_up_needed: false,
          language: 'en',
          device_type: 'desktop',
          location: 'New York',
        },
        {
          id: 'mem_056',
          content: 'Edge computing infrastructure deployment strategy',
          timestamp: '2024-01-26T09:30:00Z',
          user_id: 'user456',
          session_id: 'sess_052',
          importance: 9,
          category: 'edge',
          sentiment: 'futuristic',
          keywords: ['edge computing', 'infrastructure', 'deployment'],
          response_time: 5.6,
          context_length: 212,
          follow_up_needed: true,
          language: 'en',
          device_type: 'tablet',
          location: 'San Francisco',
        },
        {
          id: 'mem_057',
          content: 'API versioning strategy and backward compatibility',
          timestamp: '2024-01-26T11:45:00Z',
          user_id: 'user789',
          session_id: 'sess_053',
          importance: 8,
          category: 'api',
          sentiment: 'cautious',
          keywords: ['API versioning', 'backward compatibility', 'strategy'],
          response_time: 4.4,
          context_length: 189,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'London',
        },
        {
          id: 'mem_058',
          content: 'Social media integration and OAuth implementation',
          timestamp: '2024-01-26T14:00:00Z',
          user_id: 'user123',
          session_id: 'sess_054',
          importance: 7,
          category: 'integration',
          sentiment: 'social',
          keywords: ['social media', 'OAuth', 'implementation'],
          response_time: 3.9,
          context_length: 167,
          follow_up_needed: false,
          language: 'en',
          device_type: 'mobile',
          location: 'New York',
        },
        {
          id: 'mem_059',
          content: 'Machine learning pipeline monitoring and alerting',
          timestamp: '2024-01-26T16:15:00Z',
          user_id: 'user456',
          session_id: 'sess_055',
          importance: 8,
          category: 'ml',
          sentiment: 'vigilant',
          keywords: ['ML pipeline', 'monitoring', 'alerting'],
          response_time: 4.6,
          context_length: 198,
          follow_up_needed: true,
          language: 'en',
          device_type: 'desktop',
          location: 'San Francisco',
        },
        {
          id: 'mem_060',
          content: 'Distributed caching strategy implementation review',
          timestamp: '2024-01-26T18:30:00Z',
          user_id: 'user789',
          session_id: 'sess_056',
          importance: 7,
          category: 'caching',
          sentiment: 'technical',
          keywords: ['distributed caching', 'strategy', 'implementation'],
          response_time: 4.1,
          context_length: 178,
          follow_up_needed: false,
          language: 'en',
          device_type: 'tablet',
          location: 'London',
        },
      ],
    },
    {
      id: 'table-2',
      name: 'Vector store',
      type: 'local',
      schema: {
        columns: [
          { name: 'id', type: 'string', primary: true },
          { name: 'document_name', type: 'string' },
          { name: 'chunk_index', type: 'number' },
          { name: 'embedding_model', type: 'string' },
          { name: 'similarity_score', type: 'number' },
          { name: 'created_at', type: 'datetime' },
        ],
      },
      data: [
        {
          id: 'vec_001',
          document_name: 'user_manual.pdf',
          chunk_index: 0,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.89,
          created_at: '2024-01-10T08:00:00Z',
        },
        {
          id: 'vec_002',
          document_name: 'user_manual.pdf',
          chunk_index: 1,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.76,
          created_at: '2024-01-10T08:00:00Z',
        },
        {
          id: 'vec_003',
          document_name: 'api_documentation.md',
          chunk_index: 0,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.92,
          created_at: '2024-01-10T08:15:00Z',
        },
        {
          id: 'vec_004',
          document_name: 'api_documentation.md',
          chunk_index: 1,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.88,
          created_at: '2024-01-10T08:15:00Z',
        },
        {
          id: 'vec_005',
          document_name: 'privacy_policy.pdf',
          chunk_index: 0,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.67,
          created_at: '2024-01-10T08:30:00Z',
        },
        {
          id: 'vec_006',
          document_name: 'terms_of_service.pdf',
          chunk_index: 0,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.71,
          created_at: '2024-01-10T08:45:00Z',
        },
        {
          id: 'vec_007',
          document_name: 'technical_specs.docx',
          chunk_index: 0,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.94,
          created_at: '2024-01-10T09:00:00Z',
        },
        {
          id: 'vec_008',
          document_name: 'technical_specs.docx',
          chunk_index: 1,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.91,
          created_at: '2024-01-10T09:00:00Z',
        },
        {
          id: 'vec_009',
          document_name: 'technical_specs.docx',
          chunk_index: 2,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.85,
          created_at: '2024-01-10T09:00:00Z',
        },
        {
          id: 'vec_010',
          document_name: 'faq.html',
          chunk_index: 0,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.78,
          created_at: '2024-01-10T09:15:00Z',
        },
        {
          id: 'vec_011',
          document_name: 'release_notes.md',
          chunk_index: 0,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.82,
          created_at: '2024-01-10T09:30:00Z',
        },
        {
          id: 'vec_012',
          document_name: 'troubleshooting.pdf',
          chunk_index: 0,
          embedding_model: 'text-embedding-ada-002',
          similarity_score: 0.87,
          created_at: '2024-01-10T09:45:00Z',
        },
      ],
    },
    {
      id: 'table-3',
      name: 'Personas',
      type: 'global',
      schema: {
        columns: [
          { name: 'id', type: 'string', primary: true },
          { name: 'name', type: 'string' },
          { name: 'role', type: 'string' },
          { name: 'description', type: 'text' },
          { name: 'expertise_level', type: 'string' },
          { name: 'active', type: 'boolean' },
        ],
      },
      data: [
        {
          id: 'persona_001',
          name: 'Alex Thompson',
          role: 'Senior Developer',
          description:
            'Full-stack developer with 8+ years experience in React, Node.js, and cloud architecture',
          expertise_level: 'Expert',
          active: true,
        },
        {
          id: 'persona_002',
          name: 'Sarah Chen',
          role: 'Data Scientist',
          description:
            'Specialized in machine learning, statistical analysis, and data visualization with Python and R',
          expertise_level: 'Expert',
          active: true,
        },
        {
          id: 'persona_003',
          name: 'Marcus Johnson',
          role: 'Product Manager',
          description:
            'Strategic product leader with experience in agile methodologies and user experience design',
          expertise_level: 'Senior',
          active: true,
        },
        {
          id: 'persona_004',
          name: 'Emily Rodriguez',
          role: 'UX Designer',
          description:
            'Creative designer focused on user-centered design principles and accessibility standards',
          expertise_level: 'Senior',
          active: true,
        },
        {
          id: 'persona_005',
          name: 'David Kim',
          role: 'DevOps Engineer',
          description:
            'Infrastructure specialist with expertise in Kubernetes, Docker, and CI/CD pipelines',
          expertise_level: 'Expert',
          active: true,
        },
        {
          id: 'persona_006',
          name: 'Lisa Wang',
          role: 'Security Analyst',
          description:
            'Cybersecurity expert specializing in threat detection, vulnerability assessment, and compliance',
          expertise_level: 'Senior',
          active: true,
        },
        {
          id: 'persona_007',
          name: 'James Miller',
          role: 'Business Analyst',
          description:
            'Requirements gathering specialist with strong analytical and communication skills',
          expertise_level: 'Intermediate',
          active: true,
        },
        {
          id: 'persona_008',
          name: 'Rachel Green',
          role: 'Quality Assurance',
          description:
            'Testing professional with experience in automated testing frameworks and manual testing',
          expertise_level: 'Senior',
          active: false,
        },
        {
          id: 'persona_009',
          name: 'Tom Wilson',
          role: 'Technical Writer',
          description:
            'Documentation specialist creating clear, comprehensive technical and user documentation',
          expertise_level: 'Intermediate',
          active: true,
        },
        {
          id: 'persona_010',
          name: 'Anna Petrov',
          role: 'Solutions Architect',
          description:
            'Enterprise architect designing scalable, robust software solutions and system integrations',
          expertise_level: 'Expert',
          active: true,
        },
      ],
    },
    {
      id: 'table-4',
      name: 'Long term memory',
      type: 'local',
      schema: {
        columns: [
          { name: 'id', type: 'string', primary: true },
          { name: 'category', type: 'string' },
          { name: 'key', type: 'string' },
          { name: 'value', type: 'json' },
          { name: 'access_count', type: 'number' },
          { name: 'created_at', type: 'datetime' },
          { name: 'updated_at', type: 'datetime' },
        ],
      },
      data: [
        {
          id: 'ltm_001',
          category: 'user_preferences',
          key: 'theme_settings',
          value: { theme: 'dark', accent_color: '#007acc', font_size: 'medium' },
          access_count: 45,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T12:00:00Z',
        },
        {
          id: 'ltm_002',
          category: 'user_preferences',
          key: 'notification_settings',
          value: { email: true, push: false, sms: false, frequency: 'daily' },
          access_count: 12,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-10T15:30:00Z',
        },
        {
          id: 'ltm_003',
          category: 'learning_progress',
          key: 'completed_tutorials',
          value: { javascript: 100, python: 85, react: 60, sql: 40 },
          access_count: 23,
          created_at: '2024-01-05T09:00:00Z',
          updated_at: '2024-01-14T16:20:00Z',
        },
        {
          id: 'ltm_004',
          category: 'project_context',
          key: 'current_projects',
          value: {
            active: ['website_redesign', 'api_migration'],
            completed: ['user_auth', 'database_optimization'],
          },
          access_count: 67,
          created_at: '2024-01-03T10:15:00Z',
          updated_at: '2024-01-16T08:45:00Z',
        },
        {
          id: 'ltm_005',
          category: 'user_behavior',
          key: 'usage_patterns',
          value: {
            peak_hours: ['9-11', '14-16'],
            preferred_features: ['code_review', 'documentation'],
            session_duration_avg: 45,
          },
          access_count: 89,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T20:10:00Z',
        },
        {
          id: 'ltm_006',
          category: 'integrations',
          key: 'connected_services',
          value: { github: 'enabled', slack: 'enabled', jira: 'disabled', figma: 'enabled' },
          access_count: 34,
          created_at: '2024-01-02T14:30:00Z',
          updated_at: '2024-01-12T11:25:00Z',
        },
        {
          id: 'ltm_007',
          category: 'team_context',
          key: 'team_members',
          value: { developers: 5, designers: 2, managers: 1, total: 8, timezone: 'UTC-8' },
          access_count: 56,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-14T09:30:00Z',
        },
        {
          id: 'ltm_008',
          category: 'security_settings',
          key: 'access_policies',
          value: {
            mfa_enabled: true,
            session_timeout: 480,
            password_policy: 'strong',
            ip_whitelist: ['192.168.1.0/24'],
          },
          access_count: 18,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-08T13:15:00Z',
        },
        {
          id: 'ltm_009',
          category: 'workflow',
          key: 'custom_shortcuts',
          value: { save_and_run: 'Ctrl+Shift+S', quick_search: 'Ctrl+K', toggle_sidebar: 'Ctrl+B' },
          access_count: 102,
          created_at: '2024-01-02T08:00:00Z',
          updated_at: '2024-01-15T17:40:00Z',
        },
        {
          id: 'ltm_010',
          category: 'analytics',
          key: 'performance_metrics',
          value: {
            response_time_avg: 245,
            uptime_percentage: 99.8,
            error_rate: 0.02,
            user_satisfaction: 4.6,
          },
          access_count: 78,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-16T06:00:00Z',
        },
      ],
    },
  ]
}

const tables = ref<DataTable[]>([])

const filteredTables = computed(() => {
  if (!searchQuery.value) return tables.value
  return tables.value.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const selectedTable = computed(() => tables.value.find((t) => t.id === selectedTableId.value))

function selectTable(tableId: string) {
  selectedTableId.value = tableId
  showColumn2.value = true
}

function closeColumn2() {
  showColumn2.value = false
  selectedTableId.value = ''
}

function addTable() {
  // Placeholder for add table functionality
  console.log('Add table clicked')
}

// Handle column resize for collapsible behavior
function handleColumn1Resize(size: number) {
  const pixelWidth = (size / 100) * 1000
  if (pixelWidth < 100 && size > 0) {
    column1Size.value = 4
  } else {
    column1Size.value = size
  }
}

function handleColumn2Resize(size: number) {
  const pixelWidth = (size / 100) * 1000
  if (pixelWidth < 100 && size > 0) {
    column2Size.value = 4
  } else {
    column2Size.value = size
  }
}

onMounted(() => {
  tables.value = generateTableData()
})
</script>

<template>
  <TooltipProvider>
    <div class="data-tables-tab">
      <SplitterGroup direction="horizontal" auto-save-id="data-tables-columns">
        <!-- Column 1: Tables List -->
        <SplitterPanel :default-size="column1Size" :min-size="4" @resize="handleColumn1Resize">
          <div class="tables-column">
            <div class="tables-header" v-if="!isColumn1Collapsed">
              <div class="search-container">
                <Search :size="16" class="search-icon" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search tables..."
                  class="search-input"
                />
              </div>
              <button class="add-button" @click="addTable">
                <Plus :size="16" />
              </button>
            </div>
            <div class="tables-list">
              <div
                v-for="table in filteredTables"
                :key="table.id"
                class="table-item"
                :class="{
                  active: selectedTableId === table.id,
                  collapsed: isColumn1Collapsed,
                }"
                @click="selectTable(table.id)"
              >
                <div class="table-icon-container">
                  <TooltipRoot v-if="isColumn1Collapsed">
                    <TooltipTrigger as-child>
                      <Table :size="16" color="#000000" />
                    </TooltipTrigger>
                    <TooltipPortal>
                      <TooltipContent side="right" :side-offset="5">
                        {{ table.name }}
                        <TooltipArrow />
                      </TooltipContent>
                    </TooltipPortal>
                  </TooltipRoot>
                  <Table v-else :size="16" color="#000000" />
                  <Globe
                    v-if="table.type === 'global'"
                    :size="12"
                    color="#007acc"
                    class="global-indicator"
                  />
                </div>
                <div v-if="!isColumn1Collapsed" class="table-info">
                  <div class="table-name">{{ table.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </SplitterPanel>

        <SplitterResizeHandle v-if="showColumn2" class="handle" />

        <!-- Column 2: Table Visualization -->
        <SplitterPanel
          v-if="showColumn2"
          :default-size="column2Size"
          :min-size="4"
          @resize="handleColumn2Resize"
        >
          <div class="table-content-column">
            <div class="table-content" v-if="selectedTable">
              <div class="data-table-container">
                <table
                  class="data-table"
                  v-if="selectedTable.data && selectedTable.data.length > 0"
                >
                  <thead>
                    <tr>
                      <th v-for="column in selectedTable.schema?.columns || []" :key="column.name">
                        {{ column.name }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in selectedTable.data" :key="row.id">
                      <td v-for="column in selectedTable.schema?.columns || []" :key="column.name">
                        {{
                          typeof row[column.name] === 'object'
                            ? JSON.stringify(row[column.name])
                            : row[column.name]
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div v-else class="no-data">No data available</div>
              </div>
            </div>
          </div>
        </SplitterPanel>
      </SplitterGroup>
    </div>
  </TooltipProvider>
</template>

<style scoped>
.data-tables-tab {
  height: 100%;
  width: 100%;
}

.tables-column,
.table-content-column {
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tables-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  background: #f9f9f9;
}

.search-container {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 8px;
  color: #666;
}

.search-input {
  width: 100%;
  padding: 6px 8px 6px 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #007acc;
}

.add-button {
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-button:hover {
  background: #005a9e;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  margin-right: 8px;
  border-radius: 3px;
  color: #666;
}

.close-button:hover {
  background: #e9ecef;
  color: #333;
}

.tables-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.table-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.table-item:hover {
  background: #f0f0f0;
}

.table-item.active {
  background: #e3f2fd;
}

.table-item.collapsed {
  justify-content: center;
  padding: 8px 4px;
}

.table-icon-container {
  position: relative;
  display: flex;
  align-items: center;
}

.global-indicator {
  position: absolute;
  top: -4px;
  right: -4px;
  background: white;
  border-radius: 50%;
  padding: 1px;
}

.table-info {
  flex: 1;
  min-width: 0;
}

.table-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.table-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  max-width: 100%;
  min-height: 0;
}

.data-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.data-tab {
  padding: 8px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
}

.data-tab[data-state='active'] {
  color: #007acc;
  border-bottom-color: #007acc;
}

.data-table-container {
  overflow: auto;
  height: 100%;
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  flex: 1;
}

.schema-view h3,
.data-view h3,
.query-view h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.schema-table,
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 4px;
  border: 1px solid #eee;
  min-width: max-content;
}

.schema-table th,
.schema-table td,
.data-table th,
.data-table td {
  padding: 4px 6px;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.schema-table th,
.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 32px;
}

.query-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.query-input {
  width: 100%;
  height: 200px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
}

.query-input:focus {
  outline: none;
  border-color: #007acc;
}

.query-execute-button {
  align-self: flex-start;
  background: #007acc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
}

.query-execute-button:hover {
  background: #005a9e;
}

.handle {
  background-color: #ddd;
  width: 1px;
}

/* Tooltip styling */
:global([data-dismissable-layer]) {
  background-color: #000000 !important;
  color: #ffffff !important;
  border-radius: 2px !important;
  padding: 6px 8px !important;
  font-size: 12px !important;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

:global([data-dismissable-layer] svg path) {
  fill: #000000 !important;
}
</style>
