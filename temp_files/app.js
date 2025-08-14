// Sales Stack Ranker 2.0 Application Logic

// Application data
const appData = {
  "dashboard_metrics": {
    "total_pipeline": "$34,010,000",
    "qualified_pipeline": "$6,569,000", 
    "win_rate": "10.0%",
    "avg_deal_size": "$340,100",
    "predictive_score": 72,
    "pipeline_health": "Good"
  },
  "pipeline_stages": [
    {"stage": "Prospecting", "count": 25, "value": "$8,200,000", "probability": 15},
    {"stage": "Discovery", "count": 18, "value": "$6,800,000", "probability": 35},
    {"stage": "Demo/Proof", "count": 12, "value": "$5,400,000", "probability": 55},
    {"stage": "Proposal", "count": 8, "value": "$4,200,000", "probability": 75},
    {"stage": "Negotiation", "count": 5, "value": "$3,100,000", "probability": 85},
    {"stage": "Closed Won", "count": 3, "value": "$2,300,000", "probability": 100}
  ],
  "sales_reps": [
    {"name": "Sarah Johnson", "opportunities": 15, "conversion_rate": 18, "avg_deal_size": "$425,000", "score": 92, "coaching": "Focus on MEDDICC qualification"},
    {"name": "Mike Chen", "opportunities": 12, "conversion_rate": 15, "avg_deal_size": "$380,000", "score": 88, "coaching": "Improve discovery call techniques"},
    {"name": "Jessica Rodriguez", "opportunities": 18, "conversion_rate": 12, "avg_deal_size": "$290,000", "score": 85, "coaching": "Enhance stakeholder mapping"},
    {"name": "David Kim", "opportunities": 10, "conversion_rate": 22, "avg_deal_size": "$520,000", "score": 95, "coaching": "Excellent performance - mentor others"},
    {"name": "Emily Foster", "opportunities": 14, "conversion_rate": 14, "avg_deal_size": "$315,000", "score": 82, "coaching": "Work on objection handling"}
  ],
  "ai_insights": [
    {"type": "High Priority", "message": "TechCorp deal (Stage: Proposal) shows 85% close probability. Recommend scheduling exec alignment call.", "priority": "high"},
    {"type": "Risk Alert", "message": "GlobalFinance opportunity stalled 15+ days in Discovery. AI suggests champion re-engagement.", "priority": "medium"},
    {"type": "Opportunity", "message": "3 deals in Demo stage show strong MEDDICC scores. Accelerate to proposal phase.", "priority": "low"},
    {"type": "Competitive", "message": "Collibra mentioned in 4 active deals. Prepare competitive differentiation materials.", "priority": "medium"}
  ],
  "meddicc_scores": [
    {"deal": "TechCorp - Data Governance", "metrics": 85, "economic_buyer": 90, "decision_criteria": 80, "decision_process": 75, "pain": 95, "champion": 70, "overall": 82},
    {"deal": "GlobalFinance - Privacy Platform", "metrics": 70, "economic_buyer": 60, "decision_criteria": 85, "decision_process": 65, "pain": 90, "champion": 55, "overall": 71},
    {"deal": "RetailCorp - Discovery Solution", "metrics": 90, "economic_buyer": 85, "decision_criteria": 75, "decision_process": 80, "pain": 85, "champion": 90, "overall": 84}
  ]
};

// Global chart variables
let pipelineChart = null;
let performanceChart = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabNavigation();
    populateDashboard();
    populateAIInsights();
    populatePipelineAnalytics();
    populateRepPerformance();
    populatePredictiveInsights();
});

// Tab navigation
function initializeTabNavigation() {
    const navItems = document.querySelectorAll('.nav__item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all nav items and tab contents
            navItems.forEach(nav => nav.classList.remove('nav__item--active'));
            tabContents.forEach(tab => tab.classList.remove('tab-content--active'));
            
            // Add active class to clicked nav item and corresponding tab content
            this.classList.add('nav__item--active');
            document.getElementById(targetTab).classList.add('tab-content--active');
            
            // Initialize charts when pipeline or performance tabs are opened
            if (targetTab === 'pipeline' && !pipelineChart) {
                setTimeout(() => initializePipelineChart(), 100);
            } else if (targetTab === 'performance' && !performanceChart) {
                setTimeout(() => initializePerformanceChart(), 100);
            }
        });
    });
}

// Populate dashboard metrics
function populateDashboard() {
    const metrics = appData.dashboard_metrics;
    
    document.getElementById('total-pipeline').textContent = metrics.total_pipeline;
    document.getElementById('qualified-pipeline').textContent = metrics.qualified_pipeline;
    document.getElementById('win-rate').textContent = metrics.win_rate;
    document.getElementById('avg-deal-size').textContent = metrics.avg_deal_size;
}

// Populate AI insights
function populateAIInsights() {
    const insightsList = document.getElementById('insights-list');
    insightsList.innerHTML = '';
    
    appData.ai_insights.forEach(insight => {
        const insightElement = document.createElement('div');
        insightElement.className = `insight-item insight-item--${insight.priority}`;
        
        const iconClass = insight.priority === 'high' ? 'fa-exclamation-triangle' : 
                         insight.priority === 'medium' ? 'fa-info-circle' : 'fa-lightbulb';
        
        insightElement.innerHTML = `
            <div class="insight-icon insight-icon--${insight.priority}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="insight-content">
                <div class="insight-type">${insight.type}</div>
                <p class="insight-message">${insight.message}</p>
            </div>
        `;
        
        insightsList.appendChild(insightElement);
    });
}

// Populate pipeline analytics
function populatePipelineAnalytics() {
    const probabilityList = document.getElementById('probability-list');
    probabilityList.innerHTML = '';
    
    appData.pipeline_stages.forEach(stage => {
        const probabilityElement = document.createElement('div');
        probabilityElement.className = 'probability-item';
        
        const probabilityClass = stage.probability >= 80 ? 'high' : 
                                stage.probability >= 50 ? 'medium' : 'low';
        
        probabilityElement.innerHTML = `
            <div class="probability-stage">${stage.stage}</div>
            <div class="probability-score">
                <span class="probability-badge probability-badge--${probabilityClass}">
                    ${stage.probability}%
                </span>
                <span>${stage.count} deals</span>
            </div>
        `;
        
        probabilityList.appendChild(probabilityElement);
    });
    
    // Velocity metrics
    const velocityGrid = document.getElementById('velocity-grid');
    velocityGrid.innerHTML = '';
    
    const velocityData = [
        { stage: 'Prospecting', avgDays: 14 },
        { stage: 'Discovery', avgDays: 21 },
        { stage: 'Demo/Proof', avgDays: 18 },
        { stage: 'Proposal', avgDays: 12 },
        { stage: 'Negotiation', avgDays: 8 }
    ];
    
    velocityData.forEach(item => {
        const velocityElement = document.createElement('div');
        velocityElement.className = 'velocity-item';
        velocityElement.innerHTML = `
            <h4>${item.stage}</h4>
            <div class="velocity-value">${item.avgDays} days</div>
        `;
        velocityGrid.appendChild(velocityElement);
    });
}

// Initialize pipeline chart
function initializePipelineChart() {
    const ctx = document.getElementById('pipelineChart');
    if (!ctx) return;
    
    const stages = appData.pipeline_stages.map(stage => stage.stage);
    const values = appData.pipeline_stages.map(stage => 
        parseInt(stage.value.replace(/[$,]/g, '')) / 1000000
    );
    
    pipelineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stages,
            datasets: [{
                label: 'Pipeline Value ($M)',
                data: values,
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Value ($ Millions)'
                    }
                }
            }
        }
    });
}

// Populate rep performance
function populateRepPerformance() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    // Sort reps by score
    const sortedReps = [...appData.sales_reps].sort((a, b) => b.score - a.score);
    
    sortedReps.forEach((rep, index) => {
        const leaderboardElement = document.createElement('div');
        leaderboardElement.className = 'leaderboard-item';
        leaderboardElement.innerHTML = `
            <div class="leaderboard-rank">${index + 1}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${rep.name}</div>
                <div class="leaderboard-stats">
                    <span>${rep.opportunities} opportunities</span>
                    <span>${rep.conversion_rate}% conversion</span>
                    <span>${rep.avg_deal_size} avg deal</span>
                </div>
            </div>
            <div class="leaderboard-score">${rep.score}</div>
        `;
        
        // Add tooltip for coaching recommendation
        leaderboardElement.title = `Coaching: ${rep.coaching}`;
        
        leaderboardList.appendChild(leaderboardElement);
    });
}

// Initialize performance chart
function initializePerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    const repNames = appData.sales_reps.map(rep => rep.name.split(' ')[0]);
    const conversionRates = appData.sales_reps.map(rep => rep.conversion_rate);
    const scores = appData.sales_reps.map(rep => rep.score);
    
    performanceChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Rep Performance',
                data: appData.sales_reps.map(rep => ({
                    x: rep.conversion_rate,
                    y: rep.score,
                    label: rep.name
                })),
                backgroundColor: '#1FB8CD',
                borderColor: '#1FB8CD',
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const rep = appData.sales_reps[context.dataIndex];
                            return `${rep.name}: ${rep.conversion_rate}% conversion, ${rep.score} score`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Conversion Rate (%)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Performance Score'
                    }
                }
            }
        }
    });
}

// Populate predictive insights
function populatePredictiveInsights() {
    populateRecommendations();
    populateMEDDICCScores();
}

// Populate AI recommendations
function populateRecommendations() {
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = '';
    
    const recommendations = [
        {
            title: "Deal Acceleration Opportunity",
            description: "TechCorp deal shows strong buying signals. Schedule executive alignment call within 48 hours to accelerate close.",
            priority: "high"
        },
        {
            title: "Risk Mitigation Required",
            description: "GlobalFinance opportunity has been stalled for 15+ days. Champion re-engagement recommended to prevent deal loss.",
            priority: "medium"
        },
        {
            title: "Competitive Intelligence Alert",
            description: "Collibra mentioned in 4 active deals this week. Update competitive battle cards and brief sales team.",
            priority: "medium"
        },
        {
            title: "Pipeline Optimization",
            description: "3 deals in Demo stage show MEDDICC scores >80. Fast-track to proposal phase for Q4 close.",
            priority: "low"
        }
    ];
    
    recommendations.forEach(rec => {
        const recElement = document.createElement('div');
        recElement.className = 'recommendation-item';
        
        const iconClass = rec.priority === 'high' ? 'fa-bolt' : 
                         rec.priority === 'medium' ? 'fa-exclamation-circle' : 'fa-lightbulb';
        const iconColor = rec.priority === 'high' ? '#EF4444' : 
                         rec.priority === 'medium' ? '#F59E0B' : '#10B981';
        
        recElement.innerHTML = `
            <div class="recommendation-header">
                <i class="fas ${iconClass}" style="color: ${iconColor}"></i>
                <h4 class="recommendation-title">${rec.title}</h4>
            </div>
            <p class="recommendation-description">${rec.description}</p>
        `;
        
        recommendationsList.appendChild(recElement);
    });
}

// Populate MEDDICC scores
function populateMEDDICCScores() {
    const meddaccList = document.getElementById('meddicc-list');
    meddaccList.innerHTML = '';
    
    appData.meddicc_scores.forEach(deal => {
        const meddaccElement = document.createElement('div');
        meddaccElement.className = 'meddicc-item';
        
        meddaccElement.innerHTML = `
            <div class="meddicc-deal">${deal.deal}</div>
            <div class="meddicc-scores">
                <div class="meddicc-score">
                    <div class="meddicc-score-label">Metrics</div>
                    <div class="meddicc-score-value">${deal.metrics}</div>
                </div>
                <div class="meddicc-score">
                    <div class="meddicc-score-label">Econ Buyer</div>
                    <div class="meddicc-score-value">${deal.economic_buyer}</div>
                </div>
                <div class="meddicc-score">
                    <div class="meddicc-score-label">Decision</div>
                    <div class="meddicc-score-value">${deal.decision_criteria}</div>
                </div>
                <div class="meddicc-score">
                    <div class="meddicc-score-label">Process</div>
                    <div class="meddicc-score-value">${deal.decision_process}</div>
                </div>
                <div class="meddicc-score">
                    <div class="meddicc-score-label">Pain</div>
                    <div class="meddicc-score-value">${deal.pain}</div>
                </div>
                <div class="meddicc-score">
                    <div class="meddicc-score-label">Champion</div>
                    <div class="meddicc-score-value">${deal.champion}</div>
                </div>
            </div>
            <div class="meddicc-overall">
                Overall Score: ${deal.overall}
            </div>
        `;
        
        meddaccList.appendChild(meddaccElement);
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function getRandomColor() {
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click handlers for interactive elements
    const insightItems = document.querySelectorAll('.insight-item');
    insightItems.forEach(item => {
        item.addEventListener('click', function() {
            const message = this.querySelector('.insight-message').textContent;
            alert(`Action Required: ${message}`);
        });
    });
    
    // Add tooltips for MEDDICC scores
    const meddaccScores = document.querySelectorAll('.meddicc-score');
    meddaccScores.forEach(score => {
        const label = score.querySelector('.meddicc-score-label').textContent;
        const value = score.querySelector('.meddicc-score-value').textContent;
        
        const tooltips = {
            'Metrics': 'Quantifiable business impact and success criteria',
            'Econ Buyer': 'Economic buyer identification and engagement',
            'Decision': 'Decision criteria understanding and alignment',
            'Process': 'Decision-making process clarity',
            'Pain': 'Pain identification and quantification',
            'Champion': 'Champion strength and influence'
        };
        
        score.title = `${tooltips[label] || label}: ${value}/100`;
    });
});

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Randomly update predictive score
        const healthScore = document.querySelector('.health-circle span');
        if (healthScore) {
            const currentScore = parseInt(healthScore.textContent);
            const newScore = Math.max(65, Math.min(95, currentScore + Math.floor(Math.random() * 5) - 2));
            healthScore.textContent = newScore;
            
            // Update health status based on score
            const healthStatus = document.querySelector('.health-status');
            if (healthStatus) {
                if (newScore >= 80) {
                    healthStatus.textContent = 'Excellent';
                    healthStatus.parentElement.parentElement.parentElement.querySelector('.health-circle').className = 'health-circle health-circle--excellent';
                } else if (newScore >= 70) {
                    healthStatus.textContent = 'Good';
                    healthStatus.parentElement.parentElement.parentElement.querySelector('.health-circle').className = 'health-circle health-circle--good';
                } else {
                    healthStatus.textContent = 'Needs Attention';
                    healthStatus.parentElement.parentElement.parentElement.querySelector('.health-circle').className = 'health-circle health-circle--warning';
                }
            }
        }
    }, 30000); // Update every 30 seconds
}

// Start real-time updates
setTimeout(simulateRealTimeUpdates, 5000);