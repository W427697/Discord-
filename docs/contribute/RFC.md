## Goal

The goal of the RFC process is to establish a consistent and controlled path for introducing new features into the project.

Many changes, such as bug fixes and documentation improvements, can be implemented and reviewed via the normal GitHub pull request workflow. Some changes, however, are considered “substantial”, and we ask that these undergo a design process, solicit community input, and reach a consensus among the Storybook core team.

### “Feature Request” vs “RFC”

A *feature request* is a straightforward and relatively informal way for Storybook users to suggest a new feature or enhancement to the project. While feature requests can provide valuable insights and ideas, they typically do not involve an in-depth design process or require consensus among the core team. Feature requests are usually open to discussion and may or may not be implemented based on factors like popularity, feasibility, and alignment with the project's goals.

On the other hand, an *RFC* is a more formalized and structured process for proposing substantial changes or additions to the project. It involves following a defined set of steps to ensure that the proposed feature or modification receives proper consideration, design, and feedback. RFCs are typically used for changes that have a significant impact on the project, such as introducing new API functionality, removing existing features, or establishing new usage conventions. The RFC process aims to foster discussions, gather feedback from a wider audience, and reach consensus among the core team before integrating the proposed change into the project. Accepted RFCs have a higher likelihood of being implemented compared to regular feature requests.

## The RFC lifecycle

#### 1. `Status: Proposed` 

Open a new GitHub discussion in the [“RFC” category](https://github.com/storybookjs/storybook/discussions/new?category=rfc). Fill out the form as instructed. 

Details matter — RFCs that do not present convincing motivation, demonstrate lack of understanding of the design's impact, or are disingenuous about the drawbacks or alternatives tend to be poorly-received.

2. `Status: In review` 

The Storybook core team will review open RFCs regularly, and if appropriate, a core team member will be assigned as the "champion" of the RFC. The champion will work with the RFC author and guide them through the RFC process.

RFCs tend to remain in this stage for a while, giving the community and core team members time to weigh in. During this period, the author of an RFC should be prepared to revise the proposal, integrate feedback, and build consensus. RFCs that have broad support are much more likely to make progress than those that don't receive any comments. 

#### 3. `Status: accepted/rejected`

Eventually, the team will decide whether the RFC is a candidate for inclusion in Storybook. n the other hand, an RFC may be rejected by the team after public discussion has settled and comments have been made summarizing the rationale for rejection. 

### Implementing an accepted RFC

The author of an RFC is not obligated to implement it. Of course, the RFC author (like any other developer) is welcome to post an implementation for review after the RFC has been accepted. However, note that the “accepted” status does not indicate priority nor whether it’s being actively worked on. 

If you are interested in working on the implementation for an "active" RFC, but cannot determine if someone else is already working on it, feel free to ask (e.g. by leaving a comment on the associated issue).

-----

This RFC process took heavy inspiration from the RFC processes from [Rust](https://github.com/rust-lang/rfcs) and [Gatsby](https://www.gatsbyjs.com/contributing/rfc-process/).