github_org=storybookjs
my_repos="addon-onboarding"
src_dir=./code/addons
# git checkout -b monorepo-migration
for repo in $(echo $my_repos); do
  git remote add $repo git@github.com:$github_org/$repo.git
  git fetch $repo
  git read-tree --prefix=$src_dir/$repo -u $repo/next
  git add $src_dir/$repo
  git commit -m "Migrated $repo to $src_dir/$repo"
done
# git push -u origin HEAD