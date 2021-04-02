export type Label = {
    name: string
}

export class LabelManager {
    /**
     * array containing the labels
     * @protected
     */
    protected labels: string[]

    /**
     * internal change tracker to decide on API calls later
     * @protected
     */
    protected changed: boolean

    constructor(protected items: Label[]) {
        this.labels = LabelManager.getIssueLabelArray(items)
        this.changed = false
    }

    /**
     * add a label to the array in memory. Use octokit.issues.setLabels() to save
     * @param label
     */
    addLabel(label: string): void {
        if (label.length > 0) {
            if (this.labels.indexOf(label) <= 0) {
                this.labels.push(label)
                this.changed = true
            }
        }
    }

    /**
     * removes a label from the array in memory. Use octokit.issues.setLabels() to save
     * @param label
     */
    removeLabel(label: string): void {
        if (label.length > 0) {
            if (this.labels.includes(label)) {
                this.labels.splice(this.labels.indexOf(label), 1)
                this.changed = true
            }
        }
    }

    /**
     * checks if a label is assigned from a given list (i.e. checking allow/deny lists)
     * @param allowDenyList
     */
    hasLabelFromList(allowDenyList: string[]): boolean {
        const matchedList = this.labels.filter(label => allowDenyList.includes(label))

        return matchedList.length > 0
    }

    private static getIssueLabelArray(items: Label[]): string[] {
        return items.map(label => label.name)
    }
}
