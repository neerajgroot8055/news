// app/api/news/route.ts
import { NextResponse } from 'next/server';

type Article = {
  title?: string;
  author?: string;
  description?: string;
  publishedAt?: string;
  url?: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || 'latest';

  const apiKey = '77781ae1f2a9490688045e77c582ebe9'; 
  const newsApiUrl = `https://newsapi.org/v2/everything?q=${search}&pageSize=6&apiKey=${apiKey}`;

  try {
    const response = await fetch(newsApiUrl);
    const data = await response.json();

    if (data.status === 'ok') {
      return NextResponse.json(data.articles);
    } else {
      return NextResponse.json({ message: data.message }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch news', error }, { status: 500 });
  }
}
