import { ExternalLink } from "lucide-react";
import React from "react";

interface MarkdownStylerProps {
  content: string;
}

const MarkdownStyler: React.FC<MarkdownStylerProps> = ({ content }) => {
  const renderMarkdown = (text: string) => {
    const journals = text.split("\n\n").map((entry) => entry.trim());

    return journals.map((journal, index) => {
      const lines = journal.split("\n").map((line) => line.trim());
      if (lines.length < 3) return null;

      // Extract journal details
      const title = lines[0].replace(/^\d+\.\s*|\*\*/g, "").trim();

      // Extract links
      const linksRegex = /\[(.*?)\]\((.*?)\)/g;
      const tags = [...lines[1].matchAll(linksRegex)].map(
        ([_, tag, url], i) => (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-100 inline-flex text-blue-600 text-xs font-semibold px-2 py-1 rounded-full mr-2 hover:text-green-500 hover:bg-green-100"
          >
            <ExternalLink className="h-4 w-4 inline-block align-text-top mr-1" />
            {tag}
          </a>
        )
      );

      const description = lines[2].replace("**Description:**", "").trim();
      const institution = lines[3] || "";
      const country = lines[4] || "";

      return (
        <div key={index} className="border rounded-lg p-4 shadow-md bg-white">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <div className="mb-2">{tags}</div>
          <p className="text-gray-600 text-sm mb-2">{description}</p>
          <div className="flex justify-between text-gray-500 text-xs">
            <span>{institution}</span>
            <span className="font-semibold">{country}</span>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderMarkdown(content)}
    </div>
  );
};

export default MarkdownStyler;
