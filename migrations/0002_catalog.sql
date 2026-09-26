create table if not exists catalog_videos (
  id          serial primary key,
  user_id     text not null,
  video_url   text not null,
  title       text not null,
  poster      text not null,
  kind        text not null,
  category    text not null default 'Narrative',
  client      text not null default 'Personal',
  year        text not null default '2026',
  created_at  timestamptz not null default now()
);

create unique index if not exists catalog_videos_url_idx on catalog_videos (video_url);
create index if not exists catalog_videos_kind_idx on catalog_videos (kind);
