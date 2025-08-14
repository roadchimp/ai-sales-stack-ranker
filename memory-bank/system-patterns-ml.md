Feature Engineering (MVP)

Temporal: days_in_pipeline, days_in_stage, count_stage_changes_30d, time_since_last_touch.

Interaction: total_emails, total_calls, total_meetings, mean_response_time_hours, interactions_last_14d, stakeholder_count.

Qualitative flags: pricing_discussed, competitor_mentioned, exec_present, technical_questions_count bucketed.

Firmographic: industry_onehot, size_band, region, product_category.

MEDDICC coverage: metrics_flag, econ_buyer_flag, decision_criteria_flag, decision_process_flag, pain_flag, champion_flag.

Optional NLP: sentiment_avg, pain_keyword_density.

Modeling

Target: closed_won (binary) for deals that have reached terminal state; for open deals, predict 30/60/90-day close probability (survival-lite via horizon windows).

Algorithms: XGBoost (primary), Logistic regression baseline; calibrate probabilities with isotonic regression.

Validation: TimeSeriesSplit with event-date ordering; AUC, Brier score; calibration curve plots; group AUC by industry.

Pipelines

Training:

SQL to pull labeled data → pandas → train/validation split by close_date.

Train xgboost + calibration; persist artifacts(model.pkl, calibrator.pkl, feature_schema.json, version.txt).

Save metrics.json; upload to storage; insert row into model_registry table.

Batch Inference:

Query all open opportunities with latest features_snapshot.

Predict proba; compute top feature contributions via shap.TreeExplainer (summarize to top 5).

Upsert predictions.

API Contract (/api/predict)

Request: {opportunityId}

Response: {
opportunityId, probability: number,
confidence: low|med|high, topFactors: [{feature, direction, impact}],
meddicc: {scores? flags?}, cohort: {percentiles},
modelVersion, asOf
}

Monitoring

Log distribution of key features weekly; KS-stat drift alerts.

Track calibration drift with Brier score on recent closes.