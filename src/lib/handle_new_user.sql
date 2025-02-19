begin
  insert into public.sys_users (id, email, name, avatar)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
