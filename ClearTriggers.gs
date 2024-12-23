function cancelBatchProcessing() {
  // Clear all triggers to stop the batch process
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });

  // Clear progress and other script properties
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.deleteAllProperties();

  Logger.log("Batch processing has been canceled.");
}
