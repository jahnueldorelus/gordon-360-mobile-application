/**
 * To add a team, create a new object whose key is the next number after the last
 * existent key. For example, if the last key in the data object is the number "4",
 * then the new object key will be "5".  Inside of this new object, there are 3 required keys.
 *
 * 1) title (string) - The overall description of the team.
 * 2) developers (array) - The list of developers that includes their name and graduation year.
 * 3) overseers (array) - The list of supervisors/customers that includes their name,
 *                        graduation year (if available), and job role.
 */

// All the data of every team that worked on this application
export const data = {
  1: {
    title: "Concept, Development, and Product Deployment",
    developers: ["Ariarley Dospassos (Ari) '21", "Jahnuel Dorelus '21"],
    overseers: [
      "Chris Carlson '87, Dean of Student Success",
      "Dr. Russ Tuck, Professor of Computer Science",
    ],
  },
};
