import Mailjet from "node-mailjet";

type NewsArticle = {
  title: string;
  description: string;
  url: string;
};

async function getLatestNews() {
  const apiKey = process.env.NEWS_API_KEY; // Replace with your actual API key
  const countries = ["us", "gb", "ca"]; // List of countries to fetch news from
  const allArticles: Array<NewsArticle> = [];

  for (const country of countries) {
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.articles.length, "data", country);
      allArticles.push(...data.articles); // Accumulate articles from each country
    } catch (error) {
      console.error(
        `There was a problem with the fetch operation for country ${country}:`,
        error
      );
    }
  }

  const aiArticles = allArticles
    .filter((article) => article.title && article.title.includes("AI"))
    .map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
    }));

  const otherArticles = allArticles
    .filter((article) => article.title && !article.title.includes("AI"))
    .map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
    }));

  const aiSearchArticlesFromYesterday: Array<NewsArticle> = [];
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
    .toISOString()
    .split("T")[0];
  console.log(yesterday, "yesterday");
  const url = `https://newsapi.org/v2/everything?q="AI"&from=${yesterday}&to=${yesterday}&sortBy=popularity&apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    aiSearchArticlesFromYesterday.push(
      ...data.articles.filter(
        (article) => article.title && article.title.includes("AI")
      )
    ); // Accumulate articles that contain "AI"
  } catch (error) {
    console.error(
      `There was a problem with the fetch operation for AI:`,
      error
    );
  }
  const aiSection = [...aiSearchArticlesFromYesterday, ...aiArticles]
    .map((article) => `${article.title}: ${article.url}`)
    .join("\n");

  const nonAiSection = otherArticles
    .map((article) => `${article.title}: ${article.url}`)
    .join("\n");

  return `AI Articles:\n${aiSection}\n\nNon-AI Articles:\n${nonAiSection}`;
}

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_PRIMARY_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

async function sendEmail(subject: string, text: string) {
  try {
    const request = mailjet.post("send", { version: "v3.1" });
    const result = await request.request({
      Messages: [
        {
          From: {
            Email: process.env.MY_EMAIL, // Replace with your sender email
            Name: "Jacob Waldor", // Replace with your sender name
          },
          To: [
            {
              Email: process.env.MY_EMAIL,
              Name: "Jacob Waldor", // Replace with recipient name
            },
          ],
          Subject: subject,
          TextPart: text,
        },
      ],
    });
    console.log("Email sent successfully:", result.body);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// console.log();

sendEmail("Latest News (including AI)", await getLatestNews());

export {};
