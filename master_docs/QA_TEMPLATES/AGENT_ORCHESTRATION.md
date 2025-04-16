# QA & Test Plan: Agent Orchestration & API Integration

## Overview
This document outlines the quality assurance and testing approach for the Agent Orchestration system and API Integration components of the JustCreate Ecosystem. The agent orchestration system is responsible for coordinating communication between various specialized agents (DraftAgent, BlueprintAgent, VersionControlAgent, SharingAgent) and enabling seamless API integration across the VS Code extensions and cloud services.

## Unit Tests

### Agent Management
- [ ] Agent registration/deregistration
  - [ ] Verify agents can be registered with proper capabilities
  - [ ] Verify proper cleanup occurs on agent deregistration
  - [ ] Test registration of duplicate agent IDs
  - [ ] Validate agent capability advertisements

### Core Agent System
- [ ] Root Orchestrator Agent initialization and configuration
- [ ] Modality Agents (TextAgent, ImageAgent) initialization
- [ ] Lens Agents initialization and response processing

### MCP Integration
- [ ] Tool registry and tool registration verification
- [ ] Tool execution with valid/invalid parameters
- [ ] Tool result validation and error handling
- [ ] JWT authentication for MCP messages

### API Call Routing
- [ ] API call routing with valid/invalid routes
- [ ] Route parameter validation
- [ ] API versioning compatibility
- [ ] Error handling for invalid/unauthorized routes
- [ ] Rate limiting behavior

### A2A Protocol
- [ ] Agent-to-agent message sending
- [ ] Message routing between agents
- [ ] Response handling and timeouts
- [ ] Message format validation

## Integration Tests

### Agent Communication
- [ ] Agents communicate reliably
  - [ ] Test message passing between different agent types
  - [ ] Verify state preservation between agent communications
  - [ ] Test large payload handling between agents
  - [ ] Measure latency between agent communications

### Failure Handling
- [ ] Failure/retry logic
  - [ ] Agent unavailability handling
  - [ ] Retry mechanisms for transient failures
  - [ ] Circuit breaker implementation for persistent failures
  - [ ] Error propagation through agent hierarchy

### Cross-System Integration
- [ ] Cross-repo agent workflows
  - [ ] JustCreate to JustWorks agent communication
  - [ ] Blueprint agent to Versioning agent workflows
  - [ ] Text generation to image generation agent pipelines
  - [ ] Cross-extension agent communication

### Performance and Scalability
- [ ] Agent performance under load
  - [ ] Test with multiple concurrent agent requests
  - [ ] Measure memory consumption during peak loads
  - [ ] Verify agent response times remain within bounds
  - [ ] Test performance optimizations and metrics collection

### Security Testing
- [ ] Authentication between agent communications
  - [ ] JWT validation for all agent messages
  - [ ] Token expiration and refresh handling
  - [ ] Permission validation for agent operations
  - [ ] Test for security vulnerabilities in message passing

## Manual QA

### System Management
- [ ] All agents can be managed from JustWorks
  - [ ] Agent health monitoring
  - [ ] Agent activation/deactivation
  - [ ] Configuration changes propagate correctly
  - [ ] Agent logs and diagnostics accessible

### End-to-End Workflows
- [ ] End-to-end orchestration scenarios
  - [ ] CRA process full workflow (compose-resolve-answer)
  - [ ] Blueprint creation to asset generation
  - [ ] Draft version control integration
  - [ ] Social sharing and publishing flows

### User Experience
- [ ] Agent operations feedback to user
  - [ ] Progress indicators for long-running operations
  - [ ] Error messages are clear and actionable
  - [ ] Performance is smooth without UI freezes
  - [ ] Response times meet performance targets

### Resilience Testing
- [ ] System behavior under adverse conditions
  - [ ] Network disconnection handling
  - [ ] Agent process termination recovery
  - [ ] Backend service unavailability
  - [ ] Resource exhaustion handling

## Automation Strategy
- [ ] CI/CD integration for agent system tests
- [ ] Performance benchmarking for agent operations
- [ ] End-to-end test automation for critical workflows
- [ ] Chaos testing to verify resilience

## Success Criteria
- 90% unit test coverage for agent orchestration code
- All integration tests passing with <1% flakiness
- End-to-end workflows complete successfully in <3 seconds
- No critical security vulnerabilities in agent communication
- All agent operations properly authenticated and authorized

## Test Implementation Details

### Testing Tools & Framework
- **Unit Testing:** Jest for agent component tests
- **Integration Testing:** Playwright for E2E workflows
- **API Testing:** SuperTest for backend API validation
- **Performance Testing:** k6.io for load testing
- **Security Testing:** OWASP ZAP for API security testing
- **Mocking:** Sinon.js for agent/API mocking and stubbing

### Unit Test Examples

#### Agent Registration Test
```typescript
// agent-registry.test.ts
describe('Agent Registry', () => {
  let registry: AgentRegistry;
  let mockAgent: BaseAgent;
  
  beforeEach(() => {
    registry = new AgentRegistry();
    mockAgent = {
      id: 'test-agent',
      capabilities: ['textProcessing', 'imageGeneration'],
      status: 'ready'
    } as BaseAgent;
  });
  
  test('registerAgent should add agent to registry', () => {
    const result = registry.registerAgent(mockAgent);
    expect(result).toBe(true);
    expect(registry.getAgent('test-agent')).toBe(mockAgent);
  });
  
  test('registerAgent should reject duplicate agent ID', () => {
    registry.registerAgent(mockAgent);
    const duplicateAgent = { ...mockAgent };
    const result = registry.registerAgent(duplicateAgent);
    expect(result).toBe(false);
  });
  
  test('deregisterAgent should remove agent from registry', () => {
    registry.registerAgent(mockAgent);
    const result = registry.deregisterAgent('test-agent');
    expect(result).toBe(true);
    expect(registry.getAgent('test-agent')).toBeUndefined();
  });
});
```

#### MCP Tool Execution Test
```typescript
// mcp-service.test.ts
describe('MCP Service', () => {
  let mcpService: VSCodeMCPService;
  let mockContext: vscode.ExtensionContext;
  
  beforeEach(() => {
    mockContext = {
      subscriptions: []
    } as vscode.ExtensionContext;
    mcpService = new VSCodeMCPService(mockContext);
  });
  
  test('executeTool should invoke registered tool', async () => {
    const mockTool = {
      name: 'imageGeneration',
      execute: jest.fn().mockResolvedValue({ success: true, data: 'test-image' })
    };
    
    mcpService.toolRegistry.registerTool(mockTool);
    
    const result = await mcpService.executeTool('imageGeneration', {
      prompt: 'test image'
    });
    
    expect(mockTool.execute).toHaveBeenCalledWith({ prompt: 'test image' });
    expect(result).toEqual({ success: true, data: 'test-image' });
  });
  
  test('executeTool should throw error for non-existent tool', async () => {
    await expect(mcpService.executeTool('nonExistentTool', {}))
      .rejects.toThrow('Tool not found: nonExistentTool');
  });
});
```

### Integration Test Examples

#### Agent Communication Test
```typescript
// agent-communication.test.ts
describe('Agent Communication', () => {
  let a2aService: VSCodeA2AService;
  let sourceAgent: TextAgent;
  let targetAgent: ImageAgent;
  
  beforeEach(async () => {
    a2aService = new VSCodeA2AService();
    sourceAgent = new TextAgent(mockContext, a2aService);
    targetAgent = new ImageAgent(mockContext, a2aService);
    
    await sourceAgent.initialize();
    await targetAgent.initialize();
    
    a2aService.registerAgent(sourceAgent.getAgentCard());
    a2aService.registerAgent(targetAgent.getAgentCard());
  });
  
  test('should send message from source agent to target agent', async () => {
    // Setup message interception
    const messageSpy = jest.spyOn(targetAgent, 'receiveMessage');
    
    // Send message from source to target
    const response = await a2aService.sendMessage({
      source: 'textAgent',
      target: 'imageAgent',
      type: 'request',
      payload: { text: 'Generate an image of a mountain' }
    });
    
    // Verify message was received
    expect(messageSpy).toHaveBeenCalled();
    expect(messageSpy).toHaveBeenCalledWith(expect.objectContaining({
      source: 'textAgent',
      type: 'request',
      payload: { text: 'Generate an image of a mountain' }
    }));
    
    // Verify response
    expect(response.success).toBe(true);
  });
  
  test('should handle large payloads between agents', async () => {
    // Create large text payload (1MB)
    const largeText = 'A'.repeat(1024 * 1024);
    
    const response = await a2aService.sendMessage({
      source: 'textAgent',
      target: 'imageAgent',
      type: 'request',
      payload: { text: largeText }
    });
    
    expect(response.success).toBe(true);
  });
});
```

### E2E Test Scenarios

#### CRA Workflow Test
```typescript
// cra-workflow.spec.ts
test('Complete CRA workflow should succeed', async ({ page }) => {
  // Login to system
  await page.goto('/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'password');
  await page.click('#login-button');
  
  // Navigate to JustCreate editor
  await page.click('#justcreate-editor');
  
  // Write text with uncertainty marker
  const editorSelector = '.monaco-editor .view-lines';
  await page.click(editorSelector);
  await page.keyboard.type(`Character "Hero"
  Appearance: tall, muscular, ~eye color~
  Skills: [fighting, ~special ability~]`);
  
  // Trigger AI suggestion
  await page.click('#ai-suggest-button');
  
  // Wait for suggestions to appear
  await page.waitForSelector('.suggestion-item');
  
  // Accept a suggestion
  await page.click('.suggestion-item:first-child .accept-button');
  
  // Check that uncertainty was resolved
  const editorContent = await page.textContent(editorSelector);
  expect(editorContent).toContain('eye color: blue');
  
  // Save blueprint
  await page.click('#save-blueprint');
  
  // Verify saved successfully
  await page.waitForSelector('.save-success-message');
});
```

### API Test Examples

#### Agent API Endpoints
```typescript
// agent-api.test.ts
import request from 'supertest';
import { app } from '../src/app';

describe('Agent API Endpoints', () => {
  let authToken: string;
  
  beforeAll(async () => {
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'testuser', password: 'password' });
    
    authToken = loginResponse.body.token;
  });
  
  test('GET /api/v1/agents should return all agents', async () => {
    const response = await request(app)
      .get('/api/v1/agents')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('capabilities');
  });
  
  test('POST /api/v1/agents/message should route message to agent', async () => {
    const response = await request(app)
      .post('/api/v1/agents/message')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        target: 'imageAgent',
        type: 'request',
        payload: { prompt: 'A sunset over mountains' }
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('response');
  });
  
  test('GET /api/v1/agents/status should return agent statuses', async () => {
    const response = await request(app)
      .get('/api/v1/agents/status')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty('agents');
    expect(response.body.agents).toBeInstanceOf(Array);
  });
});
```

## Performance Testing Strategy

### Load Testing Approach
1. **Baseline Performance:**
   - Measure response times for key agent operations under no load
   - Establish memory usage patterns during idle state

2. **Scale Testing:**
   - Gradually increase concurrent users from 1 to 100
   - Monitor response times and error rates
   - Identify performance bottlenecks and optimization opportunities

3. **Stress Testing:**
   - Push system beyond expected load (200+ concurrent users)
   - Measure breaking points and failure modes
   - Verify graceful degradation under extreme load

### Sample k6 Test Script
```javascript
// agent-load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },   // Ramp up to 10 users
    { duration: '3m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Http errors should be less than 1%
  },
};

// Get JWT token for authentication
const getAuthToken = () => {
  const loginRes = http.post('https://api.justworks.com/api/v1/auth/login', {
    username: 'loadtest',
    password: 'loadtest-password',
  });
  return loginRes.json('token');
};

export function setup() {
  return { token: getAuthToken() };
}

export default function(data) {
  const token = data.token;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  
  // Agent status check
  const statusRes = http.get('https://api.justworks.com/api/v1/agents/status', { headers });
  check(statusRes, {
    'agent status returned 200': (r) => r.status === 200,
    'agents are available': (r) => r.json('agents').length > 0,
  });
  
  // Send message to text agent
  const textAgentRes = http.post('https://api.justworks.com/api/v1/agents/message', JSON.stringify({
    target: 'textAgent',
    type: 'request',
    payload: { text: 'Generate a product description for a smart watch' }
  }), { headers });
  
  check(textAgentRes, {
    'text agent response is 200': (r) => r.status === 200,
    'text agent response includes content': (r) => r.json('response').hasOwnProperty('content'),
  });
  
  sleep(1);
}
```

## Security Testing Checklist

### JWT Authentication
- [ ] Test JWT expiration handling
- [ ] Test JWT signature validation
- [ ] Test JWT claims validation
- [ ] Test against token replay attacks
- [ ] Test token revocation

### API Security
- [ ] Test for SQL injection in API parameters
- [ ] Test for XSS vulnerabilities in returned data
- [ ] Test API rate limiting effectiveness
- [ ] Test input validation on all endpoints
- [ ] Test CORS policy configuration
- [ ] Test content security policy

### Agent Communication Security
- [ ] Test agent message integrity validation
- [ ] Test agent permission enforcement
- [ ] Test against message tampering
- [ ] Test secure storage of agent credentials
- [ ] Test secure transmission of sensitive data

## Test Environment Requirements

### Development Environment
- Local VS Code with JustCreate extension installed
- Local JustWorks API server running
- Mock agents for testing
- Test user accounts with various permission levels

### Staging Environment
- Full deployment of all JustCreate components
- Isolated database for test data
- Monitoring tools enabled
- Network conditions simulation
- Test data generation scripts

### Production-Like Environment
- Performance testing environment matching production specs
- Load testing infrastructure
- Monitoring and alerting configured
- Database with production-like volume of data
