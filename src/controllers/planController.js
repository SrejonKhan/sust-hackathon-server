const User = require("../model/userModel");
const { successResponse, errorResponse } = require("./responseController");
const { findWithId } = require("../service/findItem");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const fakeUserData = [
  {
    question: "What is your main fitness goal for this workout?",
    answers: ["", "Burn fat", "Build muscle", "Improve cardiovascular health"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["Build muscle", "Burn fat", "Improve cardiovascular health", "Increase flexibility"],
  },
  {
    question: "What is your preferred workout intensity?",
    answers: ["", "Moderate-intensity"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["Low-intensity", "Moderate-intensity", "High-intensity"],
  },
  {
    question: "How much time do you have for your workout today?",
    answers: ["", "30-45 minutes"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["15-20 minutes", "30-45 minutes", "60+ minutes"],
  },
  {
    question: "What is your current fitness level?",
    answers: ["", "Intermediate"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    question: "Do you have any preferences for specific exercise types?",
    answers: ["", "Mix of cardio and strength training"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["Cardio only", "Strength training only", "Mix of cardio and strength training"],
  },
  {
    question: "Would you like to receive the workout instructions as:",
    answers: ["", "Text only"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["Text only", "Text with pictures", "Video demonstration"],
  },
  {
    question: "Are you following a specific training plan or program?",
    answers: ["", "No"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["Yes", "No"],
  },
  {
    question: "How Many Days Per Week do you plan to exercise?",
    answers: ["", "7 days"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["3 days", "5 days", "7 days"],
  },
  {
    question: "Do You Have any Health concerns or injuries?",
    answers: ["", "No"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["Yes", "No"],
  },
  {
    question: "What is your preferred workout environment?",
    answers: ["", "Gym"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["At Home", "Gym", "Outdoors"],
  },
  {
    question: "What Motivates you to stick to your workout routine?",
    answers: ["", "Want to see physical change in my Body"],
    isMCQ: true,
    isMultiAnswers: false,
    options: [
      "Want to see physical change in my Body",
      "To Achieve Personal Goals and Milestones",
      "Enjoying the process and feeling energized after workouts",
    ],
  },
  {
    question: "Are You More interested in -",
    answers: ["", "Building Muscle"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["Losing Weight", "Building Muscle", "Improving Overall Fitness & health"],
  },
  {
    question: "Do you have any dietary restrictions or allergies? (Select all that apply)",
    answers: ["", "Dairy-free", "Nut allergies"],
    isMCQ: true,
    isMultiAnswers: true,
    options: ["Vegetarian", "Vegan", "Gluten-free", "Dairy-free", "Nut allergies"],
  },
  {
    question: "How would you describe your current eating habits? (Select one)",
    answers: ["", "Healthy and balanced", "Convenient and processed foods"],
    isMCQ: true,
    isMultiAnswers: false,
    options: [
      "Healthy and balanced",
      "Mostly healthy, with occasional indulgences",
      "Convenient and processed foods",
      "Inconsistent with frequent changes",
    ],
  },
  {
    question: "Do you follow any specific dietary patterns? (Select one)",
    answers: ["", "No"],
    isMCQ: true,
    isMultiAnswers: false,
    options: ["No", "Yes"],
  },
  {
    question: "How much time are you willing to dedicate to meal preparation each week?",
    answers: ["", "Minimal time, prefer quick and easy meals"],
    isMCQ: true,
    isMultiAnswers: false,
    options: [
      "Minimal time, prefer quick and easy meals",
      "Some time, open to preparing simple meals",
      "Enjoy cooking and can dedicate more time to meal prep",
      "Flexible, depending on the recipe",
    ],
  },
];

const requiredFormat = `{
  "user_id": "user_123", // Replace with actual user ID
  "goals": {
    "primary_goal": "<primary_goal_from_user_data>", // e.g., "weight_loss"
    "secondary_goals": ["<secondary_goal_1>", "<secondary_goal_2>", ...]
  },
  "preferences": {
    "activity_level": "<activity_level_from_user_data>", // e.g., "moderately_active"
    "equipment": ["<equipment_1>", "<equipment_2>", ...], // e.g., ["dumbbells"]
    "diet": {
      "restrictions": ["<restriction_1>", "<restriction_2>", ...], // e.g., ["vegetarian"]
      "preferences": "<dietary_pattern_from_user_data>", // e.g., "paleo"
      "time_commitment": "<time_commitment_from_user_data>" // e.g., "minimal"
    }
  },
  "plan": {
    "workout_plan": {
      "duration": 30, // 30 days
      "frequency": {
        "cardio": "<cardio_frequency_from_prompt>", // e.g., 3 times/week
        "strength": "<strength_frequency_from_prompt>", // e.g., 2 times/week
        "rest": "<rest_days_from_prompt>" // e.g., 2 days/week
      },
      "exercises": [
        {
          "day": 1,
          "type": "<exercise_type_from_prompt>", // e.g., "cardio", "strength"
          "description": "<exercise_description_from_prompt>",
          "sets": "<sets_from_prompt>",
          "reps": "<reps_from_prompt>",
          "duration": "<duration_from_prompt>"
        },
        // ... more exercises for other days
      ]
    },
    "meal_plan": {
      "breakfast": [
        {
          "day": 1,
          "recipe": "<recipe_name_from_prompt>",
          "ingredients": ["<ingredient_1>", "<ingredient_2>", ...]
        },
        // ... more meals for other days and times
      ],
      "lunch": [
        // ... lunch meals
      ],
      "dinner": [
        // ... dinner meals
      ],
      "snacks": [
        // ... optional snacks
      ]
    }
  }
}`;

// const requiredFormatObj = `
// {
//   "user_id": "user_123", // Replace with actual user ID
//   "goals": {
//     "primary_goal": "<primary_goal_from_user_data>", // e.g., "weight_loss"
//     "secondary_goals": ["<secondary_goal_1>", "<secondary_goal_2>", ...]
//   },
//   "preferences": {
//     "activity_level": "<activity_level_from_user_data>", // e.g., "moderately_active"
//     "equipment": ["<equipment_1>", "<equipment_2>", ...], // e.g., ["dumbbells"]
//     "diet": {
//       "restrictions": ["<restriction_1>", "<restriction_2>", ...], // e.g., ["vegetarian"]
//       "preferences": "<dietary_pattern_from_user_data>", // e.g., "paleo"
//       "time_commitment": "<time_commitment_from_user_data>" // e.g., "minimal"
//     }
//   },
//   "plan": {
//     "workout_plan": {
//       "duration": 30, // 30 days
//       "frequency": {
//         "cardio": "<cardio_frequency_from_prompt>", // e.g., 3 times/week
//         "strength": "<strength_frequency_from_prompt>", // e.g., 2 times/week
//         "rest": "<rest_days_from_prompt>" // e.g., 2 days/week
//       },
//       "exercises": [
//         {
//           "day": 1,
//           "type": "<exercise_type_from_prompt>", // e.g., "cardio", "strength"
//           "description": "<exercise_description_from_prompt>",
//           "sets": "<sets_from_prompt>",
//           "reps": "<reps_from_prompt>",
//           "duration": "<duration_from_prompt>"
//         },
//         // ... more exercises for other days
//       ]
//     },
//     "meal_plan": {
//       "breakfast": [
//         {
//           "day": 1,
//           "recipe": "<recipe_name_from_prompt>",
//           "ingredients": ["<ingredient_1>", "<ingredient_2>", ...]
//         },
//         // ... more meals for other days and times
//       ],
//       "lunch": [
//         // ... lunch meals
//       ],
//       "dinner": [
//         // ... dinner meals
//       ],
//       "snacks": [
//         // ... optional snacks
//       ]
//     }
//   }
// };

const generatePlan = async (req, res, next) => {
  req.setTimeout(5000000);

  try {
    const userId = req.body.id;
    let user;
    if (userId) {
      const options = { password: 0 };
      user = await findWithId(User, userId, options);
    }

    const userData = req.body.preference;
    console.log(userData);

    const prompt = `
    **User Data:**
    ${JSON.stringify(userData)}

    Prompt:
    This user (defined in the JSON above) is looking for 30 day workout plan and meal plan. All of his requirement is mentioned.

    Generate a 30-day workout plan and meal plan for this user, adhering to the following format (no code blocks markers should exist in the response, also no whitespace, comments in json, just plain json without any formatting):
    Output Format:
    ${requiredFormat}
    `;
    // console.log(prom);
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4-0125-preview",
    });

    // console.log(completion.choices[0].message.content);
    const parts = completion.choices[0].message.content.split("\\");
    const output = parts.join("\\\\");

    const cleanedObj = JSON.parse(output);

    return successResponse(res, {
      statusCode: 200,
      message: "Plan created successfully",
      payload: { plan: cleanedObj },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const generatePlanFake = async (req, res, next) => {
  req.setTimeout(5000000);

  try {
    const payload = {
      user_id: "user_123",
      goals: {
        primary_goal: "Build muscle",
        secondary_goals: ["Burn fat", "Improve cardiovascular health"],
      },
      preferences: {
        activity_level: "Intermediate",
        equipment: ["Dumbbells", "Treadmill", "Resistance bands"],
        diet: {
          restrictions: ["Dairy-free", "Nut allergies"],
          preferences: "No",
          time_commitment: "Minimal time, prefer quick and easy meals",
        },
      },
      plan: {
        workout_plan: {
          duration: 30,
          frequency: {
            cardio: "3 times/week",
            strength: "4 times/week",
            rest: "2 days/week",
          },
          exercises: [
            {
              day: 1,
              type: "cardio",
              description: "Treadmill running",
              sets: "N/A",
              reps: "N/A",
              duration: "20 minutes",
            },
            {
              day: 2,
              type: "strength",
              description: "Dumbbell chest press",
              sets: "3 sets",
              reps: "8-12 reps",
              duration: "N/A",
            },
            {
              day: 2,
              type: "strength",
              description: "Plank",
              sets: "3 sets",
              reps: "Hold for 1 minute",
              duration: "N/A",
            },
            {
              day: 3,
              type: "rest",
              description: "Rest day",
              sets: "N/A",
              reps: "N/A",
              duration: "N/A",
            },
            {
              day: 4,
              type: "cardio",
              description: "Stationary bike cycling",
              sets: "N/A",
              reps: "N/A",
              duration: "30 minutes",
            },
            {
              day: 5,
              type: "strength",
              description: "Squats",
              sets: "3 sets",
              reps: "10-15 reps",
              duration: "N/A",
            },
            {
              day: 5,
              type: "strength",
              description: "Pull-ups",
              sets: "3 sets",
              reps: "5-8 reps",
              duration: "N/A",
            },
            {
              day: 6,
              type: "rest",
              description: "Rest day",
              sets: "N/A",
              reps: "N/A",
              duration: "N/A",
            },
            {
              day: 7,
              type: "strength",
              description: "Deadlifts",
              sets: "3 sets",
              reps: "8-12 reps",
              duration: "N/A",
            },
            {
              day: 7,
              type: "strength",
              description: "Dumbbell shoulder press",
              sets: "3 sets",
              reps: "8-12 reps",
              duration: "N/A",
            },
          ],
        },
        meal_plan: {
          breakfast: [
            {
              day: 1,
              recipe: "Avocado toast on gluten-free bread with a side of berries",
              ingredients: ["Avocado", "Gluten-free bread", "Mixed berries"],
            },
          ],
          lunch: [
            {
              day: 1,
              recipe: "Mixed salad with grilled chicken breast",
              ingredients: ["Mixed greens", "Grilled chicken breast", "Olive oil", "Lemon juice"],
            },
          ],
          dinner: [
            {
              day: 1,
              recipe: "Baked salmon with steamed broccoli and quinoa",
              ingredients: ["Salmon", "Broccoli", "Quinoa"],
            },
          ],
          snacks: [
            {
              day: 1,
              recipe: "Carrot sticks and hummus",
              ingredients: ["Carrot sticks", "Hummus"],
            },
          ],
        },
      },
    };
    return successResponse(res, {
      statusCode: 200,
      message: "Plan created successfully",
      payload: { plan: payload },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  generatePlan,
  generatePlanFake,
};
