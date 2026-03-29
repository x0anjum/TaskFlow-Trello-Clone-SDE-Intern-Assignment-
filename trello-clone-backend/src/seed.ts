import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEFAULT_USER_EMAIL = "default.user@trello.local";

const createLabels = async () => {
  const urgent = await prisma.label.create({
    data: { title: "Urgent", color: "red" },
  });
  const feature = await prisma.label.create({
    data: { title: "Feature", color: "blue" },
  });
  const bug = await prisma.label.create({
    data: { title: "Bug", color: "yellow" },
  });

  return { urgent, feature, bug };
};

async function main() {
  const defaultUser = await prisma.user.upsert({
    where: { email: DEFAULT_USER_EMAIL },
    update: { name: "Default User" },
    create: {
      name: "Default User",
      email: DEFAULT_USER_EMAIL,
      initials: "DU",
      color: "#3b82f6",
    },
  });

  const usersData = [
    { name: "Alice Adams", email: "alice@trello.local", initials: "AA", color: "#ef4444" },
    { name: "Bob Brown", email: "bob@trello.local", initials: "BB", color: "#f97316" },
    { name: "Charlie Clark", email: "charlie@trello.local", initials: "CC", color: "#eab308" },
    { name: "Dave Davis", email: "dave@trello.local", initials: "DD", color: "#22c55e" },
    { name: "Eve Evans", email: "eve@trello.local", initials: "EE", color: "#8b5cf6" },
  ];

  await prisma.user.createMany({
    data: usersData,
    skipDuplicates: true
  });

  const allSampleUsers = await prisma.user.findMany({
    where: { email: { in: usersData.map(u => u.email) } }
  });

  const board = await prisma.board.create({
    data: {
      title: "Project Alpha",
      backgroundImage: "#F4F1DE",
    },
  });

  const [todoList, doingList, doneList] = await prisma.$transaction([
    prisma.list.create({
      data: { title: "To Do", order: 1, boardId: board.id },
    }),
    prisma.list.create({
      data: { title: "Doing", order: 2, boardId: board.id },
    }),
    prisma.list.create({
      data: { title: "Done", order: 3, boardId: board.id },
    }),
  ]);

  const labels = await createLabels();

  await prisma.card.create({
    data: {
      title: "Project kickoff",
      description: "Align on scope, timeline, and deliverables.",
      order: 1,
      listId: doneList.id,
      labels: { connect: [{ id: labels.feature.id }] },
      assignees: { connect: [{ id: defaultUser.id }] },
      checklists: {
        create: [
          { title: "Invite stakeholders" },
          { title: "Prepare agenda" },
        ],
      },
    },
  });

  await prisma.card.create({
    data: {
      title: "Set up repo",
      description: "Initialize repository, linting, and CI.",
      order: 1,
      listId: todoList.id,
      labels: { connect: [{ id: labels.urgent.id }] },
      assignees: { connect: [{ id: defaultUser.id }] },
      checklists: {
        create: [
          { title: "Create repo" },
          { title: "Add README" },
        ],
      },
    },
  });

  await prisma.card.create({
    data: {
      title: "Design schema",
      description: "Finalize models and relationships.",
      order: 2,
      listId: todoList.id,
      labels: { connect: [{ id: labels.feature.id }] },
      assignees: { connect: [{ id: defaultUser.id }] },
      checklists: {
        create: [
          { title: "Review requirements" },
          { title: "Plan migrations" },
        ],
      },
    },
  });

  await prisma.card.create({
    data: {
      title: "Build API",
      description: "Implement board, list, and card endpoints.",
      order: 1,
      listId: doingList.id,
      labels: { connect: [{ id: labels.bug.id }, { id: labels.feature.id }] },
      assignees: { connect: [{ id: defaultUser.id }] },
      checklists: {
        create: [
          { title: "Create controllers" },
          { title: "Wire routes" },
          { title: "Add seed data" },
        ],
      },
    },
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
