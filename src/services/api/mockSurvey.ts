export const mockSurvey = {
  id: "1447",
  surveyId: "1447",
  orgId: "4145",
  surveyName: "Product Feedback Survey",
  surveyDescription: "Help us improve our products",
  surveyJson: {
    pages: [
      {
        name: "page1",
        title: "Product Experience",
        description: "Tell us about your experience with our product",
        questions: [
          {
            type: "rating",
            name: "satisfaction",
            title: "How satisfied are you with our product?",
            isRequired: true,
            rateMin: 0,
            rateMax: 10,
            minRateDescription: "Not satisfied",
            maxRateDescription: "Very satisfied"
          },
          {
            type: "text",
            name: "feedback",
            title: "What do you like most about our product?",
            isRequired: false,
            placeHolder: "Your feedback..."
          }
        ]
      },
      {
        name: "page2", 
        title: "Additional Information",
        questions: [
          {
            type: "radiogroup",
            name: "recommend",
            title: "Would you recommend our product to others?",
            isRequired: true,
            choices: [
              { value: "yes", text: "Yes" },
              { value: "maybe", text: "Maybe" },
              { value: "no", text: "No" }
            ]
          },
          {
            type: "checkbox",
            name: "features",
            title: "Which features do you use most?",
            isRequired: false,
            choices: [
              { value: "feature1", text: "Feature 1" },
              { value: "feature2", text: "Feature 2" },
              { value: "feature3", text: "Feature 3" },
              { value: "feature4", text: "Feature 4" }
            ]
          },
          {
            type: "comment",
            name: "suggestions",
            title: "Any suggestions for improvement?",
            isRequired: false,
            rows: 4,
            placeHolder: "Your suggestions..."
          }
        ]
      }
    ],
    completedHtml: "Thank you for your feedback! Your responses have been recorded."
  },
  themeJSON: {
    colors: {
      primary: "#007AFF",
      secondary: "#34C759"
    }
  },
  status: "ACTIVE"
};