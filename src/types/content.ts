/** Serializable content shared by the editor, public site, and API. */
export interface TopicImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface TopicVideo {
  url: string;
  title: string;
}

export interface TopicLink {
  label: string;
  url: string;
}

export interface TopicSection {
  id: string;
  title: string;
  text: string;
  links: TopicLink[];
  image?: TopicImage;
  video?: TopicVideo;
}

export interface TopicRecord {
  id: string;
  name: string;
  title: string;
  description: string;
  sections: TopicSection[];
}

export interface PageSection {
  id: string;
  title: string;
  text: string;
}

export interface PageRecord {
  title: string;
  intro: string;
  sections: PageSection[];
  email?: string;
}

export interface ContentDocument {
  topics: TopicRecord[];
  pages: {
    about: PageRecord;
    contact: PageRecord;
  };
}
