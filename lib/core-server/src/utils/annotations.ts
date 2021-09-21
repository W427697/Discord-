export async function useAnnotations(router: any) {
  router.use(async (req: any, res: any, next: any) => {
    if (!req.path.match(/\.annotations\.json$/)) {
      next();
    }

    res.end('HERE WE GO');
  });
}
